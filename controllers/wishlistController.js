// Import WishlistItem model
const WishlistItem = require('../models/wishlistItem');

const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// Validation chain for addWishlistItem
const addWishlistItemValidation = [
  body('title')
    .notEmpty()
    .withMessage('Item title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('url')
    .optional()
    .isURL()
    .withMessage('URL must be a valid URL'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
];

// Validation chain for removeWishlistItem (validate itemId param)
const removeWishlistItemValidation = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid itemId (must be a MongoDB ObjectId)'),
];

// Add new wishlist item
exports.addWishlistItem = [

  // Include validations
  addWishlistItemValidation,


  asyncHandler(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { title, description, url, image } = req.body;

    // Extract supabaseUserId from request object (see auth middleware)
    const supabaseUserId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: 'Item title is required' });
    }

    const newItem = new WishlistItem({
      supabaseUserId,
      title,
      description,
      url,
      image,
    });

    // Save new item to database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  }),
];

// Get all wishlist items for the authenticated user
exports.getWishlistItems = asyncHandler(async (req, res) => {
  // Extract supabaseUserId from request object (see auth middleware)
  const supabaseUserId = req.user.id;

  // Find all items for supabaseUserId
  const items = await WishlistItem.find({ supabaseUserId }).sort({ createdAt: -1 });
  res.json(items);
});

// Remove wishlist item
exports.removeWishlistItem = [
  // Validate itemId
  removeWishlistItemValidation, 

  asyncHandler(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract supabaseUserId from request object (see auth middleware)
    const supabaseUserId = req.user.id;

    // Extract ItemId from request params
    const itemId = req.params.itemId;

    // Find and delete item with id matching itemId
    const item = await WishlistItem.findOneAndDelete({ _id: itemId, supabaseUserId });
    if (!item) {
      return res.status(404).json({ error: 'Item not found or not authorized' });
    }

    res.json({ message: 'Item removed successfully' });
  }),
];
