import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const statusColors = {
  Pending: "text-yellow-400",
  Shipped: "text-green-400",
  Delivered: "text-blue-400",
  Cancelled: "text-red-500",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedOrderId, setUpdatedOrderId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

 const fetchOrders = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || user?.user?.token;

    const res = await axios.get("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Sort orders by most recent first
    const sortedOrders = res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setOrders(sortedOrders);
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    toast.error("Failed to fetch orders");
  } finally {
    setLoading(false);
  }
};


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order status updated");
      setUpdatedOrderId(orderId);
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err.message);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-lg animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 text-white">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-10 text-center tracking-wide">
        📦  Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <>
          <div className="space-y-8 max-w-5xl mx-auto">
            {currentOrders.map((order) => {
              const totalAmount = order.items.reduce(
                (acc, item) => acc + (item.product?.price || 0) * item.quantity,
                0
              );

              return (
                <motion.div
                  key={order._id}
                  className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-xl"
                  animate={updatedOrderId === order._id ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  onAnimationComplete={() => setUpdatedOrderId(null)}
                >
                  <div className="flex flex-col md:flex-row justify-between text-sm text-gray-400 mb-4 gap-2">
                    <span>🆔 <span className="text-white">{order._id}</span></span>
                    <span>👤 <span className="text-blue-300 font-medium">{order.user?.name || "N/A"}</span> ({order.user?.email || "N/A"})</span>
                  </div>

                  {/* Optional Address & Payment Info */}
                  {order.address && (
                    <div className="text-sm text-gray-300 mb-4">
                      📍 <span className="font-semibold">Address:</span>  {order.address.line}, {order.address.city}, {order.address.pincode} ({order.address.phone})<br />
                      💳 <span className="font-semibold">Payment:</span> {order.paymentMethod}
                    </div>
                  )}

                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg"
                      >
                        <img
                          src={item.product?.imageUrl || "/placeholder.png"}
                          alt={item.product?.name || "Product"}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="text-white font-semibold">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                          <p className="text-sm text-green-400">
                            ₹{item.product?.price || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className={`font-semibold ${statusColors[order.status]}`}>
                      Status: {order.status}
                    </p>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded-md focus:outline-none"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option
                        value="Cancelled"
                        disabled={order.status === "Shipped"}
                      >
                        Cancelled
                      </option>
                    </select>
                  </div>

                  <div className="mt-4 text-sm flex justify-between text-gray-400">
                    <span>🗓️ Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-green-400 font-bold">Total: ₹{totalAmount}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 gap-4 text-white">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 px-4 py-2 rounded disabled:opacity-50"
            >
              ◀
            </button>
            <span className="py-2 px-4 rounded bg-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 px-4 py-2 rounded disabled:opacity-50"
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
