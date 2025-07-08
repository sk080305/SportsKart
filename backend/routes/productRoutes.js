const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, protectAdmin } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin-only routes (protect → protectAdmin)
router.post("/", protect, protectAdmin, createProduct);
router.put("/:id", protect, protectAdmin, updateProduct);
router.delete("/:id", protect, protectAdmin, deleteProduct);

module.exports = router;
