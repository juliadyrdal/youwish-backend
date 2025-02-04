const express = require('express');
const router = express.Router(); 

// Require controller modules
const userController = require("../controllers/userController");
const wishlistController = require("../controllers/wishlistController");

// Import auth middleware
const verifySupabaseAuth = require('../middleware/verifySupabaseAuth')

// Create a new user
router.post('/signup', userController.createUser);

// Get user profile of current, logged in user
router.get('/profile', verifySupabaseAuth, userController.getUserProfile);

// Wishlist routes

// Add new item to wishlist
router.post('/wishlist', verifySupabaseAuth, wishlistController.addWishlistItem);

// Get wishlist of current user
router.get('/wishlist', verifySupabaseAuth, wishlistController.getWishlistItems);

// Delete specific item from wishlist
router.delete('/wishlist/:itemId', verifySupabaseAuth, wishlistController.removeWishlistItem);

module.exports = router;
