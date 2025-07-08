const Cart = require('../models/cart.model');

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (i) => i.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("Remove from cart error:", err.message);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => {
      const id = i.product._id ? i.product._id.toString() : i.product.toString();
      return id === productId;
    });

    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("Update cart error:", err.message);
    res.status(500).json({ message: "Failed to update item quantity" });
  }
};

// backend/controllers/cartController.js
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Clear cart error:", err.message);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
