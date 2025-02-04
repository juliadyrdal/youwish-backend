const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
  supabaseUserId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  url: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);
