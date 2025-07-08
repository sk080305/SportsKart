import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const backendURL = "http://localhost:5000";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [countsRes, ordersRes] = await Promise.all([
          axios.get(`${backendURL}/api/admin/dashboard-counts`, { headers }),
          axios.get(`${backendURL}/api/admin/recent-orders`, { headers }),
        ]);

        setCounts(countsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
    else {
      setError("Unauthorized: No token found");
      setLoading(false);
    }
  }, [token]);

  const cards = [
    {
      title: "Users",
      count: counts.users || 0,
      icon: <FaUsers size={30} className="text-blue-600" />,
      link: "/adminuserlist",
    },
    {
      title: "Products",
      count: counts.products || 0,
      icon: <FaBoxOpen size={30} className="text-green-600" />,
      link: "/adminproductlist",
    },
    {
      title: "Orders",
      count: counts.orders || 0,
      icon: <FaClipboardList size={30} className="text-indigo-600" />,
      link: "/adminorders",
    },
  ];

  if (loading) return <p className="text-center mt-10 text-lg">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-6 py-16">
      <motion.h1
        className="text-3xl font-bold text-center text-blue-500 mb-10 tracking-wide"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {cards.map(({ title, count, icon, link }, index) => (
          <motion.div
            key={title}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900/80 rounded-xl border border-gray-800 p-6 text-center shadow-lg cursor-pointer"
            onClick={() => navigate(link)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-center mb-3">{icon}</div>
            <h2 className="text-lg font-medium text-gray-300">{title}</h2>
            <p className="text-3xl font-bold text-white">{count}</p>
          </motion.div>
        ))}
      </div>

      {/* ✅ Recent Orders */}
      <div className="max-w-6xl mx-auto bg-gray-900/70 border border-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400">No recent orders.</p>
        ) : (
          <div className="overflow-x-auto">
          <div className="overflow-x-auto">
  <table className="w-full text-sm text-left text-gray-200">
    <thead>
      <tr className="border-b border-gray-700 text-gray-400">
        <th className="px-4 py-2">User</th>
        <th className="px-4 py-2">Email</th>
        <th className="px-4 py-2">Products</th>
        
        <th className="px-4 py-2">Status</th>
        <th className="px-4 py-2">Date</th>
      </tr>
    </thead>
    <tbody>
      {recentOrders.map((order) => (
        <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/30">
          <td className="px-4 py-2 whitespace-nowrap">
            {order.user?.name || "N/A"}
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            {order.user?.email || "N/A"}
          </td>
          <td className="px-4 py-2 max-w-xs">
            {order.items?.length > 0
              ? order.items.map((item, idx) => (
                  <div key={idx} className="truncate">
                    • {item?.product?.name || "Unknown"}
                  </div>
                ))
              : "No items"}
          </td>
          
          <td className="px-4 py-2 capitalize">
            {order.status || "N/A"}
          </td>
          <td className="px-4 py-2">
            {new Date(order.createdAt).toLocaleDateString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
