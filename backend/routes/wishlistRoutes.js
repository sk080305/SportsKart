const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');

// GET /api/wishlist - Get wishlist for logged-in user
router.get('/', protect, getWishlist);

// POST /api/wishlist/:productId - Toggle product in wishlist
router.post('/:productId', protect, toggleWishlist);

// DELETE /api/wishlist/:productId - Explicitly remove product
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
