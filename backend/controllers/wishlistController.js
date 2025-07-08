const User = require('../models/user.model');
const Product = require('../models/product.model');

// GET wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// TOGGLE wishlist item
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    if (!user || !productId) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const index = user.wishlist.findIndex((id) => id.toString() === productId);

    if (index > -1) {
      user.wishlist.splice(index, 1); // Remove
    } else {
      user.wishlist.push(productId); // Add
    }

    await user.save();
    res.json({ message: 'Wishlist updated', wishlist: user.wishlist });
  } catch (err) {
    console.error("Toggle wishlist error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== req.params.productId
    );
    await user.save();
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (err) {
    console.error("Remove wishlist error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
};
