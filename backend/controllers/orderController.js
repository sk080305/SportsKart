const Order = require('../models/order.model');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.placeOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    // Validate order items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    // Validate address
    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.line ||
      !address.city ||
      !address.pincode
    ) {
      return res.status(400).json({ message: "Incomplete address details" });
    }

    // Validate payment method
    if (!paymentMethod || !['UPI', 'COD', 'Card'].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      address,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place order error:", err.message);
    res.status(400).json({ message: "Failed to place order" });
  }
};

// @desc    Get paginated orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user.id });
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
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
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};
