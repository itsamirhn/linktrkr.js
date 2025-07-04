export async function handleWebhook(request, bot, jwtService, domain, webhookSecret) {
    try {
        // Validate webhook secret
        const incomingSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
        if (!incomingSecret || incomingSecret !== webhookSecret) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Parse the incoming update
        const update = await request.json();

        // Handle different types of updates
        if (update.message) {
            return await handleMessage(update.message, bot, jwtService, domain);
        } else if (update.inline_query) {
            return await handleInlineQuery(update.inline_query, bot, jwtService, domain);
        } else if (update.callback_query) {
            return await handleCallbackQuery(update.callback_query, bot, jwtService, domain);
        }

        // Return empty response for unhandled updates
        return { ok: true, result: {} };
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

async function handleMessage(message, bot, jwtService, domain) {
    const { text, chat, from } = message;

    if (!text) {
        return { ok: true, result: {} };
    }

    // Handle /start command
    if (text.startsWith('/start')) {
        return await handleStartCommand(message, bot, jwtService, domain);
    }

    // Handle URL input
    if (text.startsWith('http://') || text.startsWith('https://')) {
        return await handleUrlInput(message, bot, jwtService, domain);
    }

    // Default response for other messages
    return bot.createWebhookResponse('sendMessage', {
        chat_id: chat.id,
        text: "Send me a URL to create a tracking link, or use /start to see available commands.",
        reply_to_message_id: message.message_id
    });
}

async function handleStartCommand(message, bot, jwtService, domain) {
    const { chat, from } = message;

    const welcomeText = `🔗 Welcome to LinkTrkr!

I help you track when your links are clicked. Here's how to use me:

📝 Send me any URL (like https://example.com) and I'll create a tracking link for you.

🔍 You can also use me inline in any chat by typing @LinkTrkrBot followed by your URL.

📊 When someone clicks your tracking link, you'll get a notification with:
• IP address
• Browser information
• Click timestamp

Try sending me a URL now!`;

    return bot.createWebhookResponse('sendMessage', {
        chat_id: chat.id,
        text: welcomeText,
        reply_to_message_id: message.message_id
    });
}

async function handleUrlInput(message, bot, jwtService, domain) {
    const { text, chat, from } = message;

    try {
        // Validate URL
        const url = new URL(text);

        // Create tracking token
        const trackingData = {
            url: text,
            userId: from.id,
            username: from.username || from.first_name,
            timestamp: Date.now()
        };

        const token = await jwtService.encode(trackingData);
        const trackingUrl = `https://${domain}/r/${token}`;

        const responseText = `🔗 Here's your tracking link:

${trackingUrl}

📊 You'll be notified when someone clicks this link.

💡 You can also use me inline in any chat by typing @LinkTrkrBot followed by your URL.`;

        return bot.createWebhookResponse('sendMessage', {
            chat_id: chat.id,
            text: responseText,
            reply_to_message_id: message.message_id
        });
    } catch (error) {
        return bot.createWebhookResponse('sendMessage', {
            chat_id: chat.id,
            text: "❌ Please send me a valid URL (starting with http:// or https://)",
            reply_to_message_id: message.message_id
        });
    }
}

async function handleInlineQuery(inlineQuery, bot, jwtService, domain) {
    const { id, query, from } = inlineQuery;

    if (!query || (!query.startsWith('http://') && !query.startsWith('https://'))) {
        return bot.createWebhookResponse('answerInlineQuery', {
            inline_query_id: id,
            results: [],
            switch_pm_text: "Send me a URL",
            switch_pm_parameter: "start"
        });
    }

    try {
        // Validate URL
        const url = new URL(query);

        // Create tracking token
        const trackingData = {
            url: query,
            userId: from.id,
            username: from.username || from.first_name,
            timestamp: Date.now()
        };

        const token = await jwtService.encode(trackingData);
        const trackingUrl = `https://${domain}/r/${token}`;

        const inlineResult = {
            type: 'article',
            id: '1',
            title: 'Create Tracking Link',
            description: `Track clicks for: ${query}`,
            input_message_content: {
                message_text: `🔗 Tracking link created:\n\n${trackingUrl}\n\n📊 You'll be notified when someone clicks this link.`
            }
        };

        return bot.createWebhookResponse('answerInlineQuery', {
            inline_query_id: id,
            results: [inlineResult]
        });
    } catch (error) {
        return bot.createWebhookResponse('answerInlineQuery', {
            inline_query_id: id,
            results: [],
            switch_pm_text: "Invalid URL - Send me a valid URL",
            switch_pm_parameter: "start"
        });
    }
}

async function handleCallbackQuery(callbackQuery, bot, jwtService, domain) {
    return bot.createWebhookResponse('answerCallbackQuery', {
        callback_query_id: callbackQuery.id
    });
} 