export const MESSAGES = {
    WELCOME: (botUsername) => `Welcome to Link Tracker Bot! 👋🏻

Share any URL you'd like to track, and I'll provide you with a unique link that redirects to it. I'll notify you whenever someone clicks on it! 📮

Send your URL now! 🚀

Or

Use as inline bot by typing @${botUsername} and then your URL. 🌐`,

    INVALID_URL: 'This is not a valid URL.',
    INVALID_INLINE_URL: 'The url you entered is not valid. Please enter a valid URL.',
    TRACKING_URL_SUCCESS: '✅ Here is your tracking url:\n\n\`{url}\`',
    ERROR_CREATING_LINK: 'An error occurred while creating the tracking link. Please try again later.',
    SEND_URL_PROMPT: 'Please send me a URL to track, or use /start to see instructions.',
    INVALID_LINK: 'Invalid link',
    CLICK_NOTIFICATION: '📩 New Click\n<code>{url}</code>\n\n{stats}',
    NO_CLICK_INFO: '🔍No information',

    INLINE_INVALID_TITLE: 'Invalid URL ❌',
    INLINE_INVALID_DESC: 'Write a valid URL',
    INLINE_VALID_TITLE: 'Valid URL ✅',
    INLINE_VALID_DESC: 'Click to Send URL with wrapped link tracker',
    INLINE_ERROR_TITLE: 'Error ❌',
    INLINE_ERROR_DESC: 'An error occurred while creating the tracking link',
};

import { encodeJWT, getRedirectURL } from './utils.js';

export async function getStaticMainPageRedirectURL(domain, botUsername, adminChatId, jwtSecret) {
    const slug = await encodeJWT({ url: `https://t.me/${botUsername}`, chat_id: adminChatId }, jwtSecret);
    return getRedirectURL(domain, slug);
}