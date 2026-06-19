import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * Core API Routes
 * Proxies requests to Sivi Core API endpoints.
 */

// Generate designs from prompt
router.post('/designs-from-prompt', asyncHandler(async (req, res) => {
  console.time('designs-from-prompt');
  const data = await siviClient.post('/general/designs-from-prompt', req.body);
  console.timeEnd('designs-from-prompt');
  console.log('designs-from-prompt response:', data);
  res.json(data);
}));

// Get design variants
router.get('/get-design-variants', asyncHandler(async (req, res) => {
  console.time('get-design-variants');
  const data = await siviClient.get('/general/get-design-variants', {
    designId: req.query.designId,
  });
  console.timeEnd('get-design-variants');
  res.json(data);
}));

// Check status of design generation
router.get('/get-request-status', asyncHandler(async (req, res) => {
  console.time('get-request-status');
  const data = await siviClient.get('/general/get-request-status', {
    requestId: req.query.requestId,
  });
  console.timeEnd('get-request-status');
  console.log('get-request-status response:', data);
  res.json(data);
}));

// Generate designs from content
router.post('/designs-from-content', asyncHandler(async (req, res) => {
  console.time('designs-from-content');
  const data = await siviClient.post('/general/designs-from-content', req.body);
  console.timeEnd('designs-from-content');
  console.log('designs-from-content response:', data);
  res.json(data);
}));

// Generate content from prompt
router.post('/content-from-prompt', asyncHandler(async (req, res) => {
  console.time('content-from-prompt');
  const data = await siviClient.post('/general/content-from-prompt', req.body);
  console.timeEnd('content-from-prompt');
  console.log('content-from-prompt response:', data);
  res.json(data);
}));

// Update webhook URL
router.post('/update-webhook', asyncHandler(async (req, res) => {
  const { webhookUrl } = req.body;
  if (!webhookUrl || typeof webhookUrl !== 'string') {
    return res.status(400).json({ error: 'webhookUrl is required and must be a string' });
  }

  console.time('update-webhook');
  const data = await siviClient.post('/general/update-webhook', { webhookUrl });
  console.timeEnd('update-webhook');
  console.log('update-webhook response:', data);
  res.json(data);
}));

export default router;
