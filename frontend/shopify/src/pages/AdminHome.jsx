import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTools, FaStore, FaChartBar } from "react-icons/fa";

export default function AdminHome() {
  return (
    <div className="min-h-screen pt-[72px] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 py-12 text-white font-sans">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-center text-blue-500 mb-4 tracking-wide drop-shadow"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        SportsKart Admin Dashboard
      </motion.h1>

      <motion.p
        className="text-center text-gray-400 mb-14 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Efficiently manage products, users and monitor your platform’s performance.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <AdminCard
          icon={<FaChartBar size={40} />}
          iconColor="text-blue-400"
          title="Dashboard"
          description="Track live metrics: products, users, and orders."
          link="/admindashboard"
          glow="from-blue-500"
        />
        <AdminCard
          icon={<FaStore size={40} />}
          iconColor="text-green-400"
          title="Product Management"
          description="Add, update, or delete product listings with ease."
          link="/adminproductlist"
          glow="from-green-400"
        />
        <AdminCard
          icon={<FaTools size={40} />}
          iconColor="text-yellow-300"
          title="User Management"
          description="View and manage all users and admins."
          link="/adminuserlist"
          glow="from-yellow-300"
        />
      </div>
    </div>
  );
}

function AdminCard({ icon, iconColor, title, description, link, glow }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md group transition-all overflow-hidden hover:border-transparent`}
    >
      {/* Glow Border Effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br ${glow} to-transparent opacity-20 group-hover:opacity-40 blur-xl z-0 transition-all duration-500`}
      ></div>

      <div className="relative z-10 text-center">
        <div className={`mb-4 text-4xl ${iconColor}`}>{icon}</div>
        <h3 className="text-2xl font-bold mb-2 tracking-wide">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        <Link
          to={link}
          className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold text-sm transition"
        >
          Manage →
        </Link>
      </div>
    </motion.div>
  );
}
