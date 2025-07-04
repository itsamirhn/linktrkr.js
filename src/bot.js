import { MESSAGES } from './constants.js';
import { isValidURL, getRedirectURL, encodeJWT, decodeJWT, getClientIP, getUserAgent, getReferer } from './utils.js';

export class TelegramBot {
    constructor(token) {
        this.token = token;
        this.apiUrl = `https://api.telegram.org/bot${token}`;
    }

    async sendMessage(chatId, text, options = {}) {
        const response = await fetch(`${this.apiUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, ...options })
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.status}`);
        }

        return response.json();
    }

    createWebhookResponse(method, parameters) {
        return { method, ...parameters };
    }

    handleStart(message, botUsername) {
        return this.createWebhookResponse('sendMessage', {
            chat_id: message.chat.id,
            text: MESSAGES.WELCOME(botUsername),
            reply_to_message_id: message.message_id
        });
    }

    async handleText(message, jwtSecret, domain) {
        const text = message.text;

        if (!isValidURL(text)) {
            return this.createWebhookResponse('sendMessage', {
                chat_id: message.chat.id,
                text: MESSAGES.INVALID_URL,
                reply_to_message_id: message.message_id
            });
        }

        try {
            const redirectData = { url: text, chat_id: message.chat.id };
            const slug = await encodeJWT(redirectData, jwtSecret);
            const trackingURL = getRedirectURL(domain, slug);

            return this.createWebhookResponse('sendMessage', {
                chat_id: message.chat.id,
                text: MESSAGES.TRACKING_URL_SUCCESS.replace('{url}', trackingURL),
                parse_mode: 'MarkdownV2',
                disable_web_page_preview: true,
                reply_to_message_id: message.message_id
            });
        } catch (error) {
            return this.createWebhookResponse('sendMessage', {
                chat_id: message.chat.id,
                text: MESSAGES.ERROR_CREATING_LINK,
                reply_to_message_id: message.message_id
            });
        }
    }

    async handleInlineQuery(inlineQuery, jwtSecret, domain) {
        const query = inlineQuery.query.trim();

        if (!isValidURL(query)) {
            return this.createWebhookResponse('answerInlineQuery', {
                inline_query_id: inlineQuery.id,
                results: [{
                    type: 'article',
                    id: 'invalid',
                    title: MESSAGES.INLINE_INVALID_TITLE,
                    description: MESSAGES.INLINE_INVALID_DESC,
                    input_message_content: {
                        message_text: MESSAGES.INVALID_INLINE_URL,
                        parse_mode: 'Markdown'
                    },
                    reply_markup: {
                        inline_keyboard: [[{
                            text: 'Example',
                            switch_inline_query: 'https://google.com'
                        }]]
                    }
                }]
            });
        }

        try {
            const redirectData = { url: query, chat_id: inlineQuery.from.id };
            const slug = await encodeJWT(redirectData, jwtSecret);
            const trackingURL = getRedirectURL(domain, slug);

            return this.createWebhookResponse('answerInlineQuery', {
                inline_query_id: inlineQuery.id,
                results: [{
                    type: 'article',
                    id: 'valid',
                    title: MESSAGES.INLINE_VALID_TITLE,
                    description: MESSAGES.INLINE_VALID_DESC,
                    input_message_content: {
                        message_text: `<a href="${trackingURL}">${query}</a>`,
                        parse_mode: 'HTML'
                    }
                }]
            });
        } catch (error) {
            return this.createWebhookResponse('answerInlineQuery', {
                inline_query_id: inlineQuery.id,
                results: [{
                    type: 'article',
                    id: 'error',
                    title: MESSAGES.INLINE_ERROR_TITLE,
                    description: MESSAGES.INLINE_ERROR_DESC,
                    input_message_content: {
                        message_text: MESSAGES.ERROR_CREATING_LINK
                    }
                }]
            });
        }
    }

    async sendClickNotification(chatId, clickData) {
        try {
            let stats = '';

            if (clickData.ip && clickData.ip !== 'Unknown') {
                stats += `🌐IP: <b>${clickData.ip}</b>\n`;
            }

            if (clickData.userAgent && clickData.userAgent !== 'Unknown') {
                stats += `📱User-Agent: <b>${clickData.userAgent}</b>\n`;
            }

            if (clickData.referer) {
                stats += `🔗Referer: <b>${clickData.referer}</b>\n`;
            }

            if (stats === '') {
                stats = MESSAGES.NO_CLICK_INFO;
            }

            const message = MESSAGES.CLICK_NOTIFICATION
                .replace('{url}', clickData.url)
                .replace('{stats}', stats);

            await this.sendMessage(chatId, message, {
                parse_mode: 'HTML',
                disable_web_page_preview: true
            });
        } catch (error) {
            console.error('Failed to send click notification:', error);
        }
    }
}

export async function handleRedirect(request, slug, jwtSecret, bot) {
    try {
        const redirectData = await decodeJWT(slug, jwtSecret);

        if (!redirectData || !redirectData.url) {
            return new Response(MESSAGES.INVALID_LINK, { status: 400 });
        }

        const clickData = {
            url: redirectData.url,
            ip: getClientIP(request),
            userAgent: getUserAgent(request),
            referer: getReferer(request),
            timestamp: new Date().toISOString()
        };

        await bot.sendClickNotification(redirectData.chat_id, clickData);

        return Response.redirect(redirectData.url, 302);
    } catch (error) {
        return new Response(MESSAGES.INVALID_LINK, { status: 400 });
    }
} 