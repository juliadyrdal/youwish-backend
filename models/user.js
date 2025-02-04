const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  supabaseUserId: { type: String, unique: true, required: true },
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
