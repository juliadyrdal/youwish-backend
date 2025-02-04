const mongoose = require('mongoose');

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    // Already connected
    return;
  }
  try {
    // Connect to MongoDB database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectToDatabase;
