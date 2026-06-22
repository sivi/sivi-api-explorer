import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * Fonts API Routes
 * Proxies requests to Sivi Fonts API endpoints.
 */

// Get list of fonts from workspace
// Proxies to Sivi POST /general/font/get
router.post('/fonts/list', asyncHandler(async (req, res) => {
  console.time('get-fonts');
  const body = {
    ...(req.body.classification && { classification: req.body.classification }),
    ...(req.body.name && { name: req.body.name }),
    ...(req.body.source && { source: req.body.source }),
    ...(req.body.limit && { limit: Number(req.body.limit) }),
    ...(req.body.cursor && { cursor: req.body.cursor }),
    ...(req.body.abstractUserId && { abstractUserId: req.body.abstractUserId }),
  };
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/font/get', body, extraHeaders);
  console.timeEnd('get-fonts');
  console.log('get-fonts response:', data);
  res.json(data);
}));

// Upload custom fonts (async job — returns requestId)
// Proxies to Sivi POST /general/font/create
router.post('/fonts/upload', asyncHandler(async (req, res) => {
  console.time('upload-fonts');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/font/create', req.body, extraHeaders);
  console.timeEnd('upload-fonts');
  console.log('upload-fonts response:', data);
  res.json(data);
}));

export default router;
