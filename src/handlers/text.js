import { isValidURL, getRedirectURL } from '../utils/helpers.js';

export async function handleText(bot, message, jwtService, domain) {
    const text = message.text;

    if (!isValidURL(text)) {
        return bot.createWebhookResponse('sendMessage', {
            chat_id: message.chat.id,
            text: 'This is not a valid URL.',
            reply_to_message_id: message.message_id
        });
    }

    try {
        const redirectData = {
            url: text,
            chat_id: message.chat.id
        };

        const slug = await jwtService.encode(redirectData);
        const trackingURL = getRedirectURL(domain, slug);

        return bot.createWebhookResponse('sendMessage', {
            chat_id: message.chat.id,
            text: `✅ Here is your tracking url:\\n\\n\`${trackingURL}\``,
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true,
            reply_to_message_id: message.message_id
        });
    } catch (error) {
        return bot.createWebhookResponse('sendMessage', {
            chat_id: message.chat.id,
            text: 'An error occurred while creating the tracking link. Please try again later.',
            reply_to_message_id: message.message_id
        });
    }
} 