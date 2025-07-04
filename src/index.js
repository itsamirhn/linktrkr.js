import { TelegramBot, handleRedirect } from './bot.js';
import { MESSAGES, HTML_TEMPLATE } from './constants.js';

export default {
    async fetch(request, env, ctx) {
        try {
            const url = new URL(request.url);
            const pathname = url.pathname;
            const bot = new TelegramBot(env.BOT_TOKEN);
            const domain = url.hostname;

            if (pathname === '/' && request.method === 'POST') {
                const incomingSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
                if (!incomingSecret || incomingSecret !== env.WEBHOOK_SECRET) {
                    return new Response('Unauthorized', { status: 401 });
                }

                const update = await request.json();
                if (!update || !update.update_id) {
                    return new Response('Bad Request', { status: 400 });
                }

                let result = { ok: true, result: {} };

                if (update.inline_query) {
                    result = await bot.handleInlineQuery(update.inline_query, env.JWT_SECRET, domain);
                } else if (update.message) {
                    const message = update.message;

                    if (message.text && message.text.startsWith('/start')) {
                        result = bot.handleStart(message);
                    } else if (message.text) {
                        result = await bot.handleText(message, env.JWT_SECRET, domain);
                    } else {
                        result = bot.createWebhookResponse('sendMessage', {
                            chat_id: message.chat.id,
                            text: MESSAGES.SEND_URL_PROMPT,
                            reply_to_message_id: message.message_id
                        });
                    }
                } else {
                    result = { ok: true, result: {} };
                }

                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (pathname.startsWith('/r/') && request.method === 'GET') {
                const slug = pathname.slice(3);
                if (slug) {
                    return handleRedirect(request, slug, env.JWT_SECRET, bot);
                }
            }

            if (pathname === '/' && request.method === 'GET') {
                return new Response(HTML_TEMPLATE, {
                    headers: { 'Content-Type': 'text/html' }
                });
            }

            return new Response('Not Found', { status: 404 });
        } catch (error) {
            console.error('Worker error:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
}; 