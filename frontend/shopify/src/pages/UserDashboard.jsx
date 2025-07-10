import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1f2937] to-black text-white px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-6">
          Welcome Back, {user?.user?.name?.split(" ")[0] || "Athlete"}! 🏅
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Manage your gear, wishlist favorites, and track your orders — all from your personal locker.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-2">
          {/* Products */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link
              to="/products"
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-yellow-400/40 hover:border-yellow-400 transition-all duration-300 block h-full"
            >
              <FaBoxOpen className="text-4xl text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-white">Browse Products</h2>
              <p className="text-gray-400 mt-2">Explore elite gear from every game.</p>
            </Link>
          </motion.div>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link
              to="/cart"
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-green-400/40 hover:border-green-400 transition-all duration-300 block h-full"
            >
              <FaShoppingCart className="text-4xl text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <p className="text-gray-400 mt-2">Review and check out your picks.</p>
            </Link>
          </motion.div>

          {/* Wishlist */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link
              to="/wishlist"
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-pink-400/40 hover:border-pink-400 transition-all duration-300 block h-full"
            >
              <FaHeart className="text-4xl text-pink-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Wishlist</h2>
              <p className="text-gray-400 mt-2">Save what inspires you for game day.</p>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
