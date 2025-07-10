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
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-gray-900 to-black text-white px-4 py-10 pt-14">
      <h2 className="text-4xl font-extrabold text-yellow-400 text-center mb-10 drop-shadow">
        My Wishlist
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="mb-4">Start exploring products to add your favorites.</p>
          <a
            href="/products"
            className="inline-block bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-400 transition"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md hover:shadow-pink-500/20 transition flex flex-col"
            >
              <div className="w-full h-48 bg-black rounded mb-4 overflow-hidden flex justify-center items-center">
                <img
                  src={product.imageUrl || product.image || "/placeholder.png"}
                  alt={product.name}
                  className="object-contain h-full w-full"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>

              <h3 className="text-lg font-bold text-white mb-1 truncate">{product.name}</h3>
              <p className="text-yellow-400 font-semibold mb-4">₹{product.price}</p>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleToggleWishlist(product._id)}
                className="w-full mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
