import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export default function UserProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const navigate = useNavigate();

  const getToken = () => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    return userObj?.token || userObj?.user?.token;
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.map((item) => item._id));
    } catch (err) {
      toast.error("Failed to load wishlist");
      console.error(err);
    }
  };

  const handleWishlistToggle = async (productId) => {
    const token = getToken();
    if (!token) {
      toast.warning("Login to use wishlist");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `/api/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } catch (err) {
      toast.error("Could not update wishlist");
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = getToken();
    if (!token) {
      toast.warning("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "/api/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error(err);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading) return <p className="text-center mt-8">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">
        Explore Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {currentProducts.map(({ _id, name, price, imageUrl }) => (
          <div
            key={_id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 relative"
          >
            <div
              className="h-48 w-full overflow-hidden rounded-t-lg cursor-pointer"
              onClick={() => setSelectedProduct({ _id, name, price, imageUrl })}
            >
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-700">{name}</h2>
                <button onClick={() => handleWishlistToggle(_id)}>
                  {wishlist.includes(_id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </button>
              </div>

              <p className="text-green-600 font-bold text-lg">₹{price}</p>
              <button
                onClick={() => handleAddToCart(_id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 border border-gray-300 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-lg text-green-600 mb-4">₹{selectedProduct.price}</p>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </Dialog>
      )}

      {products.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No products available.</p>
      )}
    </div>
  );
}
