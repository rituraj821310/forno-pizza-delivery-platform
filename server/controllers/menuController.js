import MenuItem from '../models/MenuItem.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Customer menu
// Only available items are shown.
const listMenu = asyncHandler(async (req, res) => {
  const { category, search } = req.query

  const filter = {
    isAvailable: true,
  }

  if (category) {
    filter.category = category
  }

  if (search) {
    filter.$text = {
      $search: search,
    }
  }

  const items = await MenuItem.find(filter).sort({
    createdAt: -1,
  })

  res.json({
    items,
  })
})

// Admin menu
// Admins can see both available and unavailable items.
const listAdminMenu = asyncHandler(async (req, res) => {
  const { category, search } = req.query

  const filter = {}

  if (category) {
    filter.category = category
  }

  if (search) {
    filter.$text = {
      $search: search,
    }
  }

  const items = await MenuItem.find(filter).sort({
    createdAt: -1,
  })

  res.json({
    items,
  })
})

const getMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id)

  if (!item) {
    throw ApiError.notFound('Dish not found')
  }

  res.json({
    item,
  })
})

const createMenuItem = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    basePrice,
    category,
    tags,
    image,
  } = req.body

  if (!name?.trim()) {
    throw ApiError.badRequest('Name is required')
  }

  if (
    basePrice === undefined ||
    Number(basePrice) < 0
  ) {
    throw ApiError.badRequest(
      'A valid base price is required'
    )
  }

  const item = await MenuItem.create({
    name,
    description,
    basePrice,
    category,
    tags,
    image,
  })

  res.status(201).json({
    item,
  })
})

const updateMenuItem = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    basePrice,
    category,
    tags,
    image,
    isAvailable,
  } = req.body

  const item = await MenuItem.findById(req.params.id)

  if (!item) {
    throw ApiError.notFound('Dish not found')
  }

  if (name !== undefined) {
    item.name = name
  }

  if (description !== undefined) {
    item.description = description
  }

  if (basePrice !== undefined) {
    item.basePrice = basePrice
  }

  if (category !== undefined) {
    item.category = category
  }

  if (tags !== undefined) {
    item.tags = tags
  }

  if (image !== undefined) {
    item.image = image
  }

  if (isAvailable !== undefined) {
    item.isAvailable = isAvailable
  }

  await item.save()

  res.json({
    item,
  })
})

const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(
    req.params.id
  )

  if (!item) {
    throw ApiError.notFound('Dish not found')
  }

  res.json({
    message: 'Dish removed',
    id: req.params.id,
  })
})

export {
  listMenu,
  listAdminMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
}