
// Import User model
const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Validation chain for createUser
const createUserValidation = [
  body('supabaseUserId')
    .notEmpty()
    .withMessage('supabaseUserId is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('name')
    .optional() // Name could be optional if that suits your logic
    .isString()
    .withMessage('Name must be a string'),
];

exports.createUser = [
  // Include validation chain
  createUserValidation,

  asyncHandler(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors if any
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { supabaseUserId, email, name } = req.body;

    if (!supabaseUserId) {
      return res.status(400).json({ error: 'supabaseUserId is required' });
    }

    // Find existing user or create new
    const user = await User.findOneAndUpdate(
      { supabaseUserId },
      { email, name },
      { new: true, upsert: true }
    );

    res.json(user);
  }),
];

// Get authenticated user's profile
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  // Extract supabaseUserId from request object (see auth middleware)
  const supabaseUserId = req.user.id;

  // Find user by supabaseId
  const user = await User.findOne({ supabaseUserId }).exec();

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});
