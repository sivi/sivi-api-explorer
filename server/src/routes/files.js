import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * Files API Routes
 * Proxies requests to Sivi Files API endpoints.
 */

// Get presigned URL for direct file upload to S3
// Proxies to Sivi POST /general/files/get-presigned-url
router.post('/files/presigned-url', asyncHandler(async (req, res) => {
  console.time('get-presigned-url');
  const body = {
    type: req.body.type,
    extension: req.body.extension,
    contentType: req.body.contentType,
    ...(req.body.bId && { bId: req.body.bId }),
    ...(req.body.expiresIn && { expiresIn: Number(req.body.expiresIn) }),
    ...(req.body.abstractUserId && { abstractUserId: req.body.abstractUserId }),
  };
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/files/get-presigned-url', body, extraHeaders);
  console.timeEnd('get-presigned-url');
  console.log('get-presigned-url response:', data);
  res.json(data);
}));

export default router;
