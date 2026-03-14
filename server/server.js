import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ngrok from '@ngrok/ngrok'

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON bodies

// --- SSE: connected browser clients ---
const sseClients = new Set();

// SSE stream — browser subscribes here to receive webhook events
app.get('/webhook/events', (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    // Send a heartbeat every 30 s to keep the connection alive
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 30000);

    sseClients.add(res);
    console.log(`SSE client connected (total: ${sseClients.size})`);

    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(res);
        console.log(`SSE client disconnected (total: ${sseClients.size})`);
    });
});

// Webhook receiver — Sivi posts design results here
app.post('/webhook/receive', (req, res) => {
    console.log('Webhook received:', JSON.stringify(req.body));

    // Acknowledge immediately so Sivi doesn't retry
    res.status(200).json({ received: true });

    // Fan out to all connected browser SSE clients
    const payload = JSON.stringify(req.body);
    for (const client of sseClients) {
        client.write(`event: webhook\ndata: ${payload}\n\n`);
    }
    console.log(`Webhook event forwarded to ${sseClients.size} SSE client(s)`);
});

// generate design
app.post('/designs-from-prompt', (req, res) => {

    console.time('designs-from-prompt')
    // console.log('designs-from-prompt')
    // console.log(process.env.SIVI_API_URL)
    // console.log(req.body)

    fetch(`${process.env.SIVI_API_URL}/general/designs-from-prompt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sivi-api-key': process.env.SIVI_API_KEY
        },
        body: JSON.stringify(req.body),
    })
        .then(response => {
            console.timeEnd('designs-from-prompt')
            return response.json()
        })
        .then(data => {
            console.log(data)
            res.json(data)
        })
        .catch(error => {
            console.error('Error:', error);
            console.timeEnd('designs-from-prompt')
            res.status(500).json({ error: 'Internal Server Error' });
        })
});


// get design variants
app.get('/get-design-variants', (req, res) => {

    console.time('get-design-variants')

    const queryParams = JSON.stringify({
        designId: req.query.designId
    });
    const url = new URL(`${process.env.SIVI_API_URL}/general/get-design-variants`);
    url.searchParams.append('queryParams', queryParams);
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'sivi-api-key': process.env.SIVI_API_KEY
        },
    })
        .then(response => {
            console.timeEnd('get-design-variants')
            return response.json()
        }
        )
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error:', error);
            console.timeEnd('get-design-variants')
            res.status(500).json({ error: 'Internal Server Error' });
        })
});

// Check status of design generation
app.get('/get-request-status', (req, res) => {

    console.time('get-request-status')

    const queryParams = JSON.stringify({
        requestId: req.query.requestId
    });
    
    const url = new URL(`${process.env.SIVI_API_URL}/general/get-request-status`);
    url.searchParams.append('queryParams', queryParams);

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'sivi-api-key': process.env.SIVI_API_KEY
        }
    })
        .then(response => {
            console.timeEnd('get-request-status')
            return response.json()
        })
        .then(data => {
            console.log('get-request-status response:', data);
            res.json(data)
        })
        .catch(error => {
            console.error('Error:', error);
            console.timeEnd('get-request-status')
            res.status(500).json({ error: 'Internal Server Error' });
        })
});

// Update webhook URL
app.post('/general/update-webhook', (req, res) => {

    console.time('update-webhook')

    const { webhookUrl } = req.body;
    if (!webhookUrl || typeof webhookUrl !== 'string') {
        return res.status(400).json({ error: 'webhookUrl is required and must be a string' });
    }

    fetch(`${process.env.SIVI_API_URL}/general/update-webhook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sivi-api-key': process.env.SIVI_API_KEY
        },
        body: JSON.stringify({ webhookUrl }),
    })
        .then(response => {
            console.timeEnd('update-webhook')
            return response.json()
        })
        .then(data => {
            console.log('update-webhook response:', data)
            res.json(data)
        })
        .catch(error => {
            console.error('Error:', error);
            console.timeEnd('update-webhook')
            res.status(500).json({ error: 'Internal Server Error' });
        })
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    if (process.env.NGROK_AUTHTOKEN) {
        try {
            const listener = await ngrok.forward({
                addr: PORT,
                authtoken: process.env.NGROK_AUTHTOKEN,
                ...(process.env.NGROK_DOMAIN ? { domain: process.env.NGROK_DOMAIN } : {}),
            });
            const publicUrl = listener.url();
            console.log(`\n ngrok tunnel active`);
            console.log(` Public URL : ${publicUrl}`);
            console.log(` Webhook receiver: ${publicUrl}/webhook/receive\n`);
        } catch (err) {
            console.error('ngrok failed to start:', err.message);
        }
    } else {
        console.log('NGROK_AUTHTOKEN not set — skipping ngrok tunnel. See NGROK_SETUP.md.');
    }
});
