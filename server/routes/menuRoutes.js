import express from 'express'

import {
  listMenu,
  listAdminMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js'

import {
  protect,
  adminOnly,
} from '../middleware/auth.js'

const router = express.Router()

// Customer menu
// GET /api/menu
router.get(
  '/',
  listMenu
)

// Admin menu
// GET /api/menu/admin
router.get(
  '/admin',
  protect,
  adminOnly,
  listAdminMenu
)

// Get single menu item
// GET /api/menu/:id
router.get(
  '/:id',
  getMenuItem
)

// Create menu item
// POST /api/menu
router.post(
  '/',
  protect,
  adminOnly,
  createMenuItem
)

// Update menu item
// PUT /api/menu/:id
router.put(
  '/:id',
  protect,
  adminOnly,
  updateMenuItem
)

// Delete menu item
// DELETE /api/menu/:id
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteMenuItem
)

export default router