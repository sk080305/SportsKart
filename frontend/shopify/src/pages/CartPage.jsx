import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      if (!token) {
        toast.warning("Please login to view cart");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data || { items: [] });
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Update quantity failed:", err);
      toast.error("Could not update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Remove item failed:", err);
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = () => {
    navigate("/ordersummary");
  };

  const totalAmount = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cart.items]);

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-yellow-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-white text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-gray-900 to-black text-white px-4 py-14">
      <h2 className="text-4xl font-extrabold text-yellow-400 text-center mb-12 drop-shadow-lg">
        🛒 Your Cart
      </h2>

      {cart.items.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-xl">Your cart is empty.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 max-w-5xl mx-auto">
            {cart.items.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6 bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700"
              >
                <img 
                  loading="lazy"
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-28 h-28 object-contain rounded-md border border-gray-700 bg-black"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-white">{item.product.name}</h3>
                  <p className="text-yellow-400 font-bold">₹{item.product.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    −
                  </button>
                  <span className="font-bold text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product._id)}
                  className="ml-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto mt-12 flex justify-between items-center border-t border-gray-700 pt-6">
            <div className="text-xl font-bold text-green-400">
              Total: ₹{totalAmount}
            </div>
            <button
              className="bg-yellow-500 text-black px-8 py-2 rounded-lg hover:bg-yellow-400 transition font-bold text-lg"
              onClick={handlePlaceOrder}
            >
              Place Order 🛒
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
