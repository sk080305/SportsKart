import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || user?.user?.token;

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    // Place order
    await axios.post(
      "http://localhost:5000/api/orders",
      { items: orderItems },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ❗ Clear cart after placing order
    await axios.delete("http://localhost:5000/api/cart/clear", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Order placed!!");
    navigate("/orders");
  } catch (error) {
    console.error("Order placement failed:", error);
    toast.error("Failed to place order");
  }
};



  const fetchCart = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || user?.user?.token;

    if (!token) {
      toast.warning("Please login to view cart");
      return;
    }

    const res = await axios.get("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">🛒 Your Cart</h2>

      {cart.items.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p className="text-lg">Your cart is empty.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6 max-w-4xl mx-auto">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-6 bg-white p-5 rounded-lg shadow-md"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-700">{item.product.name}</h3>
                  <p className="text-gray-600">₹{item.product.price}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    −
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product._id)}
                  className="ml-6 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-10 text-right">
            <div className="text-xl font-semibold text-green-700 mb-4">
              Total: ₹{calculateTotal()}
            </div>
            
            <button
  className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
  onClick={handlePlaceOrder}
>
  Place Order
</button>

          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
