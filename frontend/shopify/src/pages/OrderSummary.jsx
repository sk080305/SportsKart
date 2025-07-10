import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line: "",
    city: "",
    pincode: "",
  });

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data || { items: [] });
    } catch (err) {
      toast.error("Failed to load order summary");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cart.items]);

  const confirmOrder = async () => {
    const { fullName, phone, line, city, pincode } = address;
    if (!fullName || !phone || !line || !city || !pincode) {
      toast.warning("Please fill all address fields");
      return;
    }
    if (!paymentMethod) {
      toast.warning("Please select a payment method");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.user?.token;

      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: orderItems,
          paymentMethod,
          address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order confirmed!");
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to confirm order");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-20">Loading summary...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-slate-900 text-white px-4 py-14">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
        Order Summary
      </h1>

      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg space-y-8">
        {/* Cart items */}
        <ul className="space-y-6 border-b border-gray-600 pb-6">
          {cart.items.map((item) => (
            <li
              key={item.product._id}
              className="flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-400">
                  ₹{item.product.price} × {item.quantity}
                </p>
              </div>
              <div className="text-green-400 font-bold">
                ₹{item.product.price * item.quantity}
              </div>
            </li>
          ))}
        </ul>

        {/* Address Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">
            Delivery Address
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              className="bg-gray-700 text-white p-2 rounded"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              className="bg-gray-700 text-white p-2 rounded"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address Line"
              className="bg-gray-700 text-white p-2 rounded col-span-2"
              value={address.line}
              onChange={(e) =>
                setAddress({ ...address, line: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              className="bg-gray-700 text-white p-2 rounded"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Pincode"
              className="bg-gray-700 text-white p-2 rounded"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
          </div>
        </div>

        {/* Payment method selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">
            Choose Payment Method
          </h3>
          <div className="space-y-2">
            {["UPI", "COD", "Card"].map((method) => (
              <label key={method} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-yellow-400"
                />
                <span>{method === "COD" ? "Cash on Delivery" : method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order total + button */}
        <div className="text-right border-t border-gray-700 pt-6">
          <p className="text-xl font-bold text-green-400 mb-2">
            Total: ₹{totalAmount}
          </p>
          <p className="text-sm text-gray-400 mb-6">Delivery estimate: 3–5 days</p>
          <button
            onClick={confirmOrder}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2 rounded transition"
          >
            Confirm Order ✅
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
