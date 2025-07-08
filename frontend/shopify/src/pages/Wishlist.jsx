import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.user?.token || user?.token;

  const fetchWishlist = async () => {
    if (!token) {
      toast.warning("Please login to view wishlist");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(res.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!token) return toast.warning("Please login to modify wishlist");

    try {
      await axios.post(
        `http://localhost:5000/api/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) return toast.warning("Please login to add to cart");

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
        My Wishlist 💖
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center mt-20 text-gray-600">
          <div className="text-6xl mb-3">🛒</div>
          <h3 className="text-xl font-semibold mb-2">
            Your wishlist is empty!
          </h3>
          <p className="mb-4">Start adding products you love 💖</p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <img
                src={product.imageUrl || product.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-3"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <h3 className="text-lg font-semibold text-blue-700">{product.name}</h3>
              <p className="text-green-600 font-bold mt-1">₹{product.price}</p>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart 🛍️
                </button>
                <button
                  onClick={() => handleToggleWishlist(product._id)}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Remove from Wishlist ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
