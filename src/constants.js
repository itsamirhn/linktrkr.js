export const MESSAGES = {
    WELCOME: `Welcome to Link Tracker Bot! 👋🏻

Share any URL you'd like to track, and I'll provide you with a unique link that redirects to it. I'll notify you whenever someone clicks on it! 📮

Send your URL now! 🚀

Or

Use as inline bot by typing @LinkTrkrBot and then your URL. 🌐`,

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
    INLINE_ERROR_DESC: 'An error occurred while creating the tracking link'
};

export const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LinkTrkr - URL Tracker Bot</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 {
            text-align: center;
            font-size: 3em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            text-align: center;
            font-size: 1.2em;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .feature h3 {
            margin-top: 0;
            color: #ffeb3b;
        }
        .cta {
            text-align: center;
            margin-top: 40px;
        }
        .btn {
            display: inline-block;
            background: #2196F3;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        }
        .github-link {
            text-align: center;
            margin-top: 20px;
            opacity: 0.8;
        }
        .github-link a {
            color: #ffeb3b;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 LinkTrkr</h1>
        <p class="subtitle">Track your shared links and get notified when someone clicks them!</p>
        
        <div class="features">
            <div class="feature">
                <h3>🔔 Real-Time Notifications</h3>
                <p>Get instantly notified when your link is clicked with IP address and browser information.</p>
            </div>
            <div class="feature">
                <h3>🔒 Privacy Focused</h3>
                <p>No database storage - your data is encoded in JWT tokens and never stored.</p>
            </div>
            <div class="feature">
                <h3>⚡ Fast & Lightweight</h3>
                <p>Runs on Cloudflare Workers for blazing fast performance worldwide.</p>
            </div>
            <div class="feature">
                <h3>🌐 Inline Support</h3>
                <p>Use inline mode in any Telegram chat to quickly create tracking links.</p>
            </div>
        </div>
        
        <div class="cta">
            <a href="https://t.me/LinkTrkrBot" class="btn">🚀 Start Tracking Links</a>
        </div>
        
        <div class="github-link">
            <p>JavaScript version of the <a href="https://github.com/itsamirhn/linktrkr" target="_blank">original Go project</a></p>
        </div>
    </div>
</body>
</html>`; 