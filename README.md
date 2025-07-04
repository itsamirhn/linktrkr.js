# LinkTrkr - JavaScript Version

This is a fully AI-generated JavaScript conversion of the original [LinkTrkr](https://github.com/itsamirhn/linktrkr) Go project, designed to be deployed for free on Cloudflare Workers.

## Quick Start

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Set up secrets:**

   ```bash
   wrangler secret put BOT_TOKEN
   wrangler secret put JWT_SECRET
   wrangler secret put WEBHOOK_SECRET
   ```

3. **Configure domain:**
   - Edit `wrangler.jsonc` and set your domain
   - Update routes configuration

4. **Deploy:**

   ```bash
   yarn deploy
   ```

5. **Set webhook:**

   ```bash
   curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "YOUR_WORKER_URL", "secret_token": "YOUR_WEBHOOK_SECRET"}'
   ```

## LICENSE
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
