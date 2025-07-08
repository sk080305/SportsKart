const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const {
  protect,
  protectAdmin
} = require("../middlewares/authMiddleware");

const {
  getDashboardCounts,
  getRecentOrders,
  getRecentUsers
} = require("../controllers/adminController");

// ✅ Dashboard counts
router.get("/dashboard-counts", protect, protectAdmin, getDashboardCounts);

// ✅ Recent activity
router.get("/recent-orders", protect, protectAdmin, getRecentOrders);
router.get("/recent-users", protect, protectAdmin, getRecentUsers);

// ✅ Get all users
router.get("/users", protect, protectAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err.message);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// ✅ Delete user
router.delete("/users/:id", protect, protectAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error deleting user" });
  }
});

module.exports = router;
