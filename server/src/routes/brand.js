import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * Brand API Routes
 * Proxies requests to Sivi Brand API endpoints.
 */

// Get list of brands from workspace
// Proxies to Sivi POST /general/get-brands (accepts limit, cursor, abstractUserId)
router.post('/brands/list', asyncHandler(async (req, res) => {
  console.log('req.body', req.body);
  console.time('get-brands');
  const body = {
    ...(req.body.limit && { limit: Number(req.body.limit) }),
    ...(req.body.cursor && { cursor: req.body.cursor }),
    ...(req.body.abstractUserId && { abstractUserId: req.body.abstractUserId }),
    ...(req.body.bId && { bId: req.body.bId }),
  };
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  console.log({body, extraHeaders});
  const data = await siviClient.post('/general/get-brands', body, extraHeaders);
  console.timeEnd('get-brands');
  console.log('get-brands response:', data);
  res.json(data);
}));

// Create a new brand identity
router.post('/brands', asyncHandler(async (req, res) => {
  console.time('create-brand');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/brand/create', req.body, extraHeaders);
  console.timeEnd('create-brand');
  console.log('create-brand response:', data);
  res.json(data);
}));

// Extract brand from website URL (async job — returns requestId)
router.post('/brand/extract', asyncHandler(async (req, res) => {
  console.time('extract-brand');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/brand/extract', req.body, extraHeaders);
  console.timeEnd('extract-brand');
  console.log('extract-brand response:', data);
  res.json(data);
}));

// Set default brand for workspace
router.post('/brand/set-default', asyncHandler(async (req, res) => {
  console.time('set-default-brand');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/brand/set-default', req.body, extraHeaders);
  console.timeEnd('set-default-brand');
  console.log('set-default-brand response:', data);
  res.json(data);
}));

// Archive a brand from workspace
router.post('/brand/archive', asyncHandler(async (req, res) => {
  console.time('archive-brand');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/brand/archive', req.body, extraHeaders);
  console.timeEnd('archive-brand');
  console.log('archive-brand response:', data);
  res.json(data);
}));

// Update an existing brand
router.post('/brand/update', asyncHandler(async (req, res) => {
  console.time('update-brand');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/brand/update', req.body, extraHeaders);
  console.timeEnd('update-brand');
  console.log('update-brand response:', data);
  res.json(data);
}));

export default router;
