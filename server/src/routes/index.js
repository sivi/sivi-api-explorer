import { Router } from 'express';
import coreRoutes from './core.js';
import brandRoutes from './brand.js';
import webhookRoutes from './webhook.js';

const router = Router();

router.use('/webhook', webhookRoutes);
router.use('/', coreRoutes);
router.use('/', brandRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
