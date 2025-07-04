export async function handleStart(bot, message) {
    const welcomeText = `Welcome to Link Tracker Bot! 👋🏻

Share any URL you'd like to track, and I'll provide you with a unique link that redirects to it. I'll notify you whenever someone clicks on it! 📮

Send your URL now! 🚀

Or

Use as inline bot by typing @LinkTrackerBot and then your URL. 🌐`;

    return bot.createWebhookResponse('sendMessage', {
        chat_id: message.chat.id,
        text: welcomeText,
        reply_to_message_id: message.message_id
    });
} 