const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['hospital', 'doctor', 'lab', 'pharmacy'],
    required: true
  },
  itemId: {
    type: String, // String to support both MongoDB ObjectIds and external Google Place IDs
    required: true
  },
  name: {
    type: String,
    required: true
  },
  details: {
    address: String,
    phone: String,
    rating: Number,
    specialists: [String],
    image: String,
    website: String
  }
}, {
  timestamps: true
});

favoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
