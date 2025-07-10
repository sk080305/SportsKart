import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (pageNum = 1) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      if (!token) {
        toast.warning("Please login to view your orders");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/orders/my?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Fetch orders error:", err.message);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const cancelOrder = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      await axios.delete(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order cancelled successfully");
      fetchOrders(page);
    } catch (err) {
      console.error("Cancel order failed:", err.message);
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading)
    return (
      <p className="text-center text-white mt-10">Loading your orders...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-gray-900 to-black text-white px-4 py-10 pt-14">
      <h2 className="text-4xl font-extrabold text-yellow-400 text-center mb-10 drop-shadow">
        Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">You have no orders yet.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => {
            const totalAmount = order.items.reduce(
              (acc, item) =>
                acc + (item.product?.price || 0) * item.quantity,
              0
            );

            return (
              <div
                key={order._id}
                className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700"
              >
                <div className="mb-3 flex justify-between text-sm text-gray-300">
                  <span className="text-xs">Order ID: {order._id}</span>
                  <span className="text-sm">
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        order.status === "Shipped"
                          ? "text-green-400"
                          : order.status === "Cancelled"
                          ? "text-red-400"
                          : "text-yellow-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </span>
                </div>

                {/* Address & Payment */}
                {order.address && (
                  <div className="text-sm text-gray-400 mb-4">
                    <p>
                      📍 <span className="font-semibold">Address:</span>{" "}
                      {order.address.line}, {order.address.city},{" "}
                      {order.address.pincode} ({order.address.phone})
                    </p>
                    <p>
                      💳 <span className="font-semibold">Payment:</span>{" "}
                      {order.paymentMethod}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b border-gray-700 pb-3"
                    >
                      <img
                        src={item.product?.imageUrl || "/placeholder.png"}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {item.product?.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-green-300 font-semibold">
                          ₹{item.product?.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.status === "Pending" && (
                  <button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      setShowModal(true);
                    }}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel Order
                  </button>
                )}

                <div className="mt-4 text-sm flex justify-between text-gray-400">
                  <span className="text-green-400 font-bold">
                    Total: ₹{totalAmount}
                  </span>
                  <span>
                    Placed on:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
              {[...Array(totalPages).keys()].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    page === i + 1
                      ? "bg-yellow-500 text-black font-bold"
                      : "bg-gray-700 text-white"
                  } hover:scale-105 transition`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-center border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Cancel Order
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await cancelOrder(selectedOrderId);
                  setShowModal(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
