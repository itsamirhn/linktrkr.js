export class TelegramBot {
    constructor(token) {
        this.token = token;
        this.apiUrl = `https://api.telegram.org/bot${token}`;
    }

    async sendMessage(chatId, text, options = {}) {
        const payload = {
            chat_id: chatId,
            text: text,
            ...options
        };

        const response = await fetch(`${this.apiUrl}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.status}`);
        }

        return await response.json();
    }

    async answerInlineQuery(queryId, results, options = {}) {
        const payload = {
            inline_query_id: queryId,
            results: results,
            ...options
        };

        const response = await fetch(`${this.apiUrl}/answerInlineQuery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to answer inline query: ${response.status}`);
        }

        return await response.json();
    }

    async setWebhook(url, options = {}) {
        const payload = {
            url: url,
            ...options
        };

        const response = await fetch(`${this.apiUrl}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to set webhook: ${response.status}`);
        }

        return await response.json();
    }

    createWebhookResponse(method, parameters) {
        return {
            method: method,
            ...parameters
        };
    }
} 