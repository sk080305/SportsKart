const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');

// 🧾 Place a new order
router.post('/', protect, placeOrder);

// 👤 Get logged-in user's orders
router.get('/my', protect, getUserOrders);

// 🔐 Get all orders (Admin only)
router.get('/', protect, protectAdmin, getAllOrders);

// 🔄 Update order status (Admin only)
router.put('/:orderId/status', protect, protectAdmin, updateOrderStatus);

// ❌ Cancel a pending order (user)
router.delete('/:orderId/cancel', protect, cancelOrder);

module.exports = router;
