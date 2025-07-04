import { isValidURL, getRedirectURL } from '../utils/helpers.js';

export async function handleInlineQuery(bot, inlineQuery, jwtService, domain) {
    const query = inlineQuery.query.trim();

    if (!isValidURL(query)) {
        const invalidResult = {
            type: 'article',
            id: 'invalid',
            title: 'Invalid URL ❌',
            description: 'Write a valid URL',
            input_message_content: {
                message_text: 'The url you entered is not valid. Please enter a valid URL.',
                parse_mode: 'Markdown'
            },
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Example',
                    switch_inline_query: 'https://google.com'
                }]]
            }
        };

        return bot.createWebhookResponse('answerInlineQuery', {
            inline_query_id: inlineQuery.id,
            results: [invalidResult]
        });
    }

    try {
        const redirectData = {
            url: query,
            chat_id: inlineQuery.from.id
        };

        const slug = await jwtService.encode(redirectData);
        const trackingURL = getRedirectURL(domain, slug);

        const validResult = {
            type: 'article',
            id: 'valid',
            title: 'Valid URL ✅',
            description: 'Click to Send URL with wrapped link tracker',
            input_message_content: {
                message_text: `<a href="${trackingURL}">${query}</a>`,
                parse_mode: 'HTML'
            }
        };

        return bot.createWebhookResponse('answerInlineQuery', {
            inline_query_id: inlineQuery.id,
            results: [validResult]
        });
    } catch (error) {
        const errorResult = {
            type: 'article',
            id: 'error',
            title: 'Error ❌',
            description: 'An error occurred while creating the tracking link',
            input_message_content: {
                message_text: 'An error occurred while creating the tracking link. Please try again later.'
            }
        };

        return bot.createWebhookResponse('answerInlineQuery', {
            inline_query_id: inlineQuery.id,
            results: [errorResult]
        });
    }
}