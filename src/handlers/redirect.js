import { getClientIP, getUserAgent, getReferer } from '../utils/helpers.js';

export async function handleRedirect(request, slug, jwtService, bot) {
    try {
        // Decode the JWT to get redirect data
        const redirectData = await jwtService.decode(slug);

        if (!redirectData || !redirectData.url) {
            return new Response('Invalid link', { status: 400 });
        }

        // Extract click information
        const clickData = {
            url: redirectData.url,
            ip: getClientIP(request),
            userAgent: getUserAgent(request),
            referer: getReferer(request),
            timestamp: new Date().toISOString()
        };

        // Send notification to user (async, don't wait for response)
        sendClickNotification(bot, redirectData.chat_id, clickData);

        // Redirect to the original URL
        return Response.redirect(redirectData.url, 302);
    } catch (error) {
        return new Response('Invalid link', { status: 400 });
    }
}

async function sendClickNotification(bot, chatId, clickData) {
    try {
        let stats = '';

        if (clickData.ip && clickData.ip !== 'Unknown') {
            stats += `🌐IP: <b>${clickData.ip}</b>\\n`;
        }

        if (clickData.userAgent && clickData.userAgent !== 'Unknown') {
            stats += `📱User-Agent: <b>${clickData.userAgent}</b>\\n`;
        }

        if (clickData.referer) {
            stats += `🔗Referer: <b>${clickData.referer}</b>\\n`;
        }

        if (stats === '') {
            stats = '🔍No information';
        }

        const message = `📩 New Click\\n<code>${clickData.url}</code>\\n\\n${stats}`;

        await bot.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    } catch (error) {
        console.error('Failed to send click notification:', error);
    }
} 