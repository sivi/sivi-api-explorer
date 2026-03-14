# ngrok Setup Guide

ngrok creates a public HTTPS tunnel to your local server so that the Sivi API can deliver webhook results to `POST /webhook/receive`.

---

## 1. Create a free ngrok account

1. Go to [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup) and sign up.
2. After logging in, open **Your Authtoken** from the left sidebar:  
   [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Copy the token — it looks like `2abc...XYZ_...`.

---

## 2. Add the token to your `.env`

Open `server/.env` and add:

```env
NGROK_AUTHTOKEN=your_ngrok_authtoken
```

The server reads this on startup and automatically opens the tunnel. No separate `ngrok` CLI needed.

---

## 3. Start the server

```bash
yarn dev
```

On boot you will see output like:

```
Server is running on port 4000

 ngrok tunnel active
 Public URL : https://abc123.ngrok-free.app
 Webhook receiver: https://abc123.ngrok-free.app/webhook/receive
```

Copy the **Webhook receiver** URL — that is what you register with the Sivi API via the **⚙ Webhook** modal in the UI.

---

## 4. Register the webhook URL with Sivi

1. Open the app in the browser.
2. Click **⚙ Webhook** in the header.
3. Paste `https://abc123.ngrok-free.app/webhook/receive` into the Webhook URL field.
4. Click **Save Webhook** — this calls the Sivi API to register the URL.
5. Enable the toggle (**Webhook ON**) before generating a design.

---

## 5. Optional — fixed subdomain (no URL change on every restart)

Free accounts get a random subdomain on each restart. To keep a stable URL:

- **Free static domain**: ngrok offers one free static domain per account.  
  Claim it at [https://dashboard.ngrok.com/domains](https://dashboard.ngrok.com/domains), then add to `.env`:

```env
NGROK_DOMAIN=your-static-subdomain.ngrok-free.app
```

- **Paid plans** support custom domains (e.g. `webhooks.yourcompany.com`).

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ngrok failed to start: …authtoken…` | Check `NGROK_AUTHTOKEN` is set correctly in `.env` |
| `ERR_NGROK_108` — session limit | Free plan allows 1 concurrent agent; kill any other ngrok process |
| Sivi not calling the webhook | Verify the URL was saved (modal shows "saved successfully") and the tunnel is active |
| Tunnel URL changes after restart | Use a free static domain (see §5) |
