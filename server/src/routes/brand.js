import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * Brand API Routes
 * Proxies requests to Sivi Brand API endpoints.
 * Falls back gracefully if the endpoint is not available (404).
 */

// Get list of brands from workspace
// Proxies to Sivi POST /brand/get (accepts limit, cursor, abstractUserId)
router.post('/brands/list', asyncHandler(async (req, res) => {
  console.log('req.body', req.body);
  console.time('get-brands');
  try {
    const body = {
      limit: Number(req.body.limit) || 100,
      ...(req.body.cursor && { cursor: req.body.cursor }),
      ...(req.body.abstractUserId && { abstractUserId: req.body.abstractUserId }),
      ...(req.body.bId && { bId: req.body.bId }),
    };
    const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
    const data = await siviClient.post('/brand/get', body, extraHeaders);
    console.timeEnd('get-brands');
    console.log('get-brands response:', data);
    res.json(data);
  } catch (err) {
    console.timeEnd('get-brands');
    if (err.statusCode === 404) {
      console.warn('Sivi Brand API endpoint /brand/get returned 404. Brand API may not be enabled for this workspace.');
      return res.status(200).json({
        status: 200,
        body: { brands: [] },
        note: 'Brand API returned 404 — this endpoint may not be enabled for your Sivi workspace or the path may differ. Check your Sivi API plan.',
      });
    }
    throw err;
  }
}));

// Create a new brand identity
router.post('/brands', asyncHandler(async (req, res) => {
  console.time('create-brand');
  try {
    const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
    const data = await siviClient.post('/brand/create-brand', req.body, extraHeaders);
    console.timeEnd('create-brand');
    console.log('create-brand response:', data);
    res.json(data);
  } catch (err) {
    console.timeEnd('create-brand');
    if (err.statusCode === 404) {
      console.warn('Sivi Brand API endpoint /brand/create-brand returned 404. Brand API may not be enabled for this workspace.');
      return res.status(200).json({
        status: 200,
        body: { brandId: null },
        note: 'Brand API returned 404 — this endpoint may not be enabled for your Sivi API plan.',
      });
    }
    throw err;
  }
}));

// Extract brand from website URL (async job — returns requestId)
router.post('/brand/extract', asyncHandler(async (req, res) => {
  console.time('extract-brand');
  try {
    const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
    const data = await siviClient.post('/brand/extract-brand', req.body, extraHeaders);
    console.timeEnd('extract-brand');
    console.log('extract-brand response:', data);
    res.json(data);
  } catch (err) {
    console.timeEnd('extract-brand');
    if (err.statusCode === 404) {
      console.warn('Sivi Brand API endpoint /brand/extract-brand returned 404.');
      return res.status(200).json({
        status: 200,
        body: { requestId: null, note: 'Brand extract API returned 404.' },
        note: 'Brand API returned 404 — this endpoint may not be enabled for your Sivi API plan.',
      });
    }
    throw err;
  }
}));

// Set default brand for workspace
router.post('/brand/set-default', asyncHandler(async (req, res) => {
  console.time('set-default-brand');
  try {
    const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
    const data = await siviClient.post('/brand/set-default-brand', req.body, extraHeaders);
    console.timeEnd('set-default-brand');
    console.log('set-default-brand response:', data);
    res.json(data);
  } catch (err) {
    console.timeEnd('set-default-brand');
    if (err.statusCode === 404) {
      console.warn('Sivi Brand API endpoint /brand/set-default-brand returned 404.');
      return res.status(200).json({
        status: 200,
        body: { success: false },
        note: 'Brand API returned 404 — this endpoint may not be enabled for your Sivi API plan.',
      });
    }
    throw err;
  }
}));

// Archive a brand from workspace
router.post('/brand/archive', asyncHandler(async (req, res) => {
  console.time('archive-brand');
  try {
    const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
    const data = await siviClient.post('/brand/archive-brand', req.body, extraHeaders);
    console.timeEnd('archive-brand');
    console.log('archive-brand response:', data);
    res.json(data);
  } catch (err) {
    console.timeEnd('archive-brand');
    if (err.statusCode === 404) {
      console.warn('Sivi Brand API endpoint /brand/archive-brand returned 404.');
      return res.status(200).json({
        status: 200,
        body: { success: false },
        note: 'Brand API returned 404 — this endpoint may not be enabled for your Sivi API plan.',
      });
    }
    throw err;
  }
}));

// Update an existing brand
router.post('/brand/update', asyncHandler(async (req, res) => {
  console.time('update-brand');
  try {
    const extraHeaders = req.body.workspaceId ? { 'Workspace-Id': req.body.workspaceId } : {};
    const data = await siviClient.post('/brand/update-brand', req.body, extraHeaders);
    console.timeEnd('update-brand');
    console.log('update-brand response:', data);
    res.json(data);
  } catch (err) {
    console.timeEnd('update-brand');
    if (err.statusCode === 404) {
      console.warn('Sivi Brand API endpoint /brand/update-brand returned 404.');
      return res.status(200).json({
        status: 200,
        body: { success: false },
        note: 'Brand API returned 404 — this endpoint may not be enabled for your Sivi API plan.',
      });
    }
    throw err;
  }
}));

export default router;
