const express = require('express');
const router = express.Router();
const {
  getCart, addToCart, removeFromCart , updateCartItemQuantity,clearCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.put('/:productId', protect, updateCartItemQuantity);
router.delete('/clear', protect, clearCart);



module.exports = router;
