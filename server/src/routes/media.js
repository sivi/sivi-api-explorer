import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * Media API Routes
 * Proxies requests to Sivi Media API endpoints.
 */

// Get media assets from workspace
// Proxies to Sivi POST /media/get
router.post('/media/list', asyncHandler(async (req, res) => {
  console.time('get-media');
  const body = {
    ...(req.body.type && { type: req.body.type }),
    ...(req.body.subType && { subType: req.body.subType }),
    ...(req.body.mId && { mId: req.body.mId }),
    ...(req.body.bId && { bId: req.body.bId }),
    ...(req.body.limit && { limit: Number(req.body.limit) }),
    ...(req.body.cursor && { cursor: req.body.cursor }),
    ...(req.body.sort && { sort: req.body.sort }),
    ...(req.body.abstractUserId && { abstractUserId: req.body.abstractUserId }),
  };
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/media/get', body, extraHeaders);
  console.timeEnd('get-media');
  console.log('get-media response:', data);
  res.json(data);
}));

// Create a new media asset
// Proxies to Sivi POST /media/create
router.post('/media/create', asyncHandler(async (req, res) => {
  console.time('create-media');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/media/create', req.body, extraHeaders);
  console.timeEnd('create-media');
  console.log('create-media response:', data);
  res.json(data);
}));

// Update an existing media asset
// Proxies to Sivi POST /media/update
router.post('/media/update', asyncHandler(async (req, res) => {
  console.time('update-media');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/media/update', req.body, extraHeaders);
  console.timeEnd('update-media');
  console.log('update-media response:', data);
  res.json(data);
}));

// Delete media assets from workspace
// Proxies to Sivi POST /media/delete
router.post('/media/delete', asyncHandler(async (req, res) => {
  console.time('delete-media');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/media/delete', req.body, extraHeaders);
  console.timeEnd('delete-media');
  console.log('delete-media response:', data);
  res.json(data);
}));

// Generate or enhance images using AI
// Proxies to Sivi POST /media/generate
router.post('/media/generate', asyncHandler(async (req, res) => {
  console.time('generate-media');
  const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
  const data = await siviClient.post('/general/media/generate', req.body, extraHeaders);
  console.timeEnd('generate-media');
  console.log('generate-media response:', data);
  res.json(data);
}));

export default router;
