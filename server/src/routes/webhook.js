import { Router } from 'express';
import webhookService from '../services/webhookService.js';

const router = Router();

// SSE stream — browser subscribes here to receive webhook events
router.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  // Send a heartbeat every 30s to keep the connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  webhookService.addClient(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    webhookService.removeClient(res);
  });
});

// Webhook receiver — Sivi posts design results here
router.post('/receive', (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body));

  // Acknowledge immediately so Sivi doesn't retry
  res.status(200).json({ received: true });

  // Fan out to all connected browser SSE clients
  webhookService.broadcast(req.body);
});

export default router;
