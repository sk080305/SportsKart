const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

// @desc    Get count of users, products, and orders for admin dashboard
// @route   GET /api/admin/dashboard-counts
// @access  Private/Admin
exports.getDashboardCounts = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({
      users: userCount,
      products: productCount,
      orders: orderCount,
    });
  } catch (error) {
    console.error("Dashboard counts error:", error.message);
    res.status(500).json({ message: "Failed to fetch dashboard counts" });
  }
};

// GET /api/admin/recent-orders
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email") // ✅ Fetch name & email
      .populate("items.product", "name price image") // ✅ Product info
      .select("user items totalAmount status createdAt"); // ✅ Include fields

    res.status(200).json(recentOrders);
  } catch (err) {
    console.error("Recent orders error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// GET /api/admin/recent-users
exports.getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(recentUsers);
  } catch (err) {
    console.error("Recent users error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
