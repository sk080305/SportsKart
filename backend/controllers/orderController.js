const Order = require('../models/order.model');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place order error:", err.message);
    res.status(400).json({ message: "Failed to place order" });
  }
};

// @desc    Get orders for logged-in user
// @route   GET /api/orders/my
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error("Get user orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:orderId/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err.message);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// @desc    Cancel a user's order (if still pending)
// @route   DELETE /api/orders/:orderId/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.id });

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      console.log("Order status is not Pending");
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'Cancelled';

    await order.save(); // 🔥 if this throws an error, catch block will show it

    
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};