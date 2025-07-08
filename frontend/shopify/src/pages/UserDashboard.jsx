import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-50 py-12 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome 👋
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          Track your orders, manage your cart, and explore new arrivals — all in one place!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link
              to="/products"
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition border-t-4 border-blue-500 block h-full"
            >
              <FaBoxOpen className="text-3xl text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-blue-800">Browse Products</h2>
              <p className="text-gray-600 mt-2">Discover gear across your favorite sports.</p>
            </Link>
          </motion.div>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link
              to="/cart"
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition border-t-4 border-green-500 block h-full"
            >
              <FaShoppingCart className="text-3xl text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-800">Your Cart</h2>
              <p className="text-gray-600 mt-2">Review and manage items in your cart.</p>
            </Link>
          </motion.div>

          {/* Wishlist */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link
              to="/wishlist"
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition border-t-4 border-pink-500 block h-full"
            >
              <FaHeart className="text-3xl text-pink-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-pink-700">Wishlist</h2>
              <p className="text-gray-600 mt-2">Save your favorites for later.</p>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
