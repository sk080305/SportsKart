import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      if (!token) {
        toast.warning("Please login to view your orders");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err.message);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      await axios.delete(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      console.error("Cancel order failed:", err.message);
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">🧾 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-lg shadow border border-gray-200"
            >
              <div className="mb-3 flex justify-between text-sm text-gray-500">
                <span>Order ID: {order._id}</span>
                <span>
                  Status:{" "}
                  <span className="font-semibold text-blue-700">{order.status}</span>
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.product?.imageUrl || "/placeholder.png"}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-blue-800">{item.product?.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-green-700">₹{item.product?.price}</p>
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
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}

              <div className="mt-4 text-sm text-gray-500 text-right">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cancel Order</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
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
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
