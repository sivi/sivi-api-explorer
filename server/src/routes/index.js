import { Router } from 'express';
import coreRoutes from './core.js';
import brandRoutes from './brand.js';
import mediaRoutes from './media.js';
import filesRoutes from './files.js';
import fontsRoutes from './fonts.js';
import userRoutes from './user.js';
import webhookRoutes from './webhook.js';

const router = Router();

router.use('/webhook', webhookRoutes);
router.use('/', coreRoutes);
router.use('/', brandRoutes);
router.use('/', mediaRoutes);
router.use('/', filesRoutes);
router.use('/', fontsRoutes);
router.use('/', userRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
