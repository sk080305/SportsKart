import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

export default function UserHome() {
  const dashboardItems = [
    {
      title: "My Orders",
      description: "Check the status of all your past orders.",
      icon: <FaShoppingCart size={30} className="text-blue-600" />,
      link: "/orders", // ✅ use lowercase path
    },
    
    {
      title: "My Profile",
      description: "Edit your details and manage account info.",
      icon: <FaUser size={30} className="text-purple-600" />,
      link: "/userprofile",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-blue-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Your SportsKart Hub 🏏
        </motion.h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10">
          Track orders, wishlist items, and manage your account — all in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {dashboardItems.map(({ title, description, icon, link }, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition"
            >
              {icon}
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-800">{title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{description}</p>
              <Link
                to={link}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Go
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
