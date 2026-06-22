import { Router } from 'express';
import siviClient from '../services/siviClient.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

/**
 * User Management API Routes
 * Proxies requests to Sivi Super/User Management API endpoints.
 */

// Login or create a user
router.post('/user/login', asyncHandler(async (req, res) => {
  console.time('login-user');
  const data = await siviClient.post('/super/login-user', req.body);
  console.timeEnd('login-user');
  console.log('login-user response:', data);
  res.json(data);
}));

// Delete a user and their workspace
router.post('/user/delete', asyncHandler(async (req, res) => {
  console.time('delete-user');
  const data = await siviClient.post('/super/delete-user', req.body);
  console.timeEnd('delete-user');
  console.log('delete-user response:', data);
  res.json(data);
}));

// Set user credit limit for current billing cycle
router.post('/user/credit-limit', asyncHandler(async (req, res) => {
  console.time('set-user-credit-limit');
  const data = await siviClient.post('/super/set-user-credit-limit', req.body);
  console.timeEnd('set-user-credit-limit');
  console.log('set-user-credit-limit response:', data);
  res.json(data);
}));

export default router;
