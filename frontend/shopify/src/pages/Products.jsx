import React, { useEffect, useState, Fragment } from "react";
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

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-10 px-4">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-10 drop-shadow-md">
        Explore Our Gear
      </h1>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: productsPerPage }).map((_, i) => (
            <div key={i} className="bg-gray-800 h-72 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {currentProducts.map(({ _id, name, price, imageUrl, description }) => (
              <div
                key={_id}
                className="bg-gray-800 text-white rounded-xl shadow-md hover:shadow-yellow-500/20 transition-all duration-300 flex flex-col overflow-hidden border border-gray-700"
              >
                <div
                  className="w-full h-56 bg-white flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedProduct({ _id, name, price, imageUrl, description })}
                >
                  <img
                    src={imageUrl?.startsWith("http") ? imageUrl : `http://localhost:5000/${imageUrl || "placeholder.png"}`}
                    alt={name}
                    className="max-h-52 w-full object-contain p-2"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-white truncate">{name}</h2>
                    <button onClick={() => handleWishlistToggle(_id)}>
                      {wishlist.includes(_id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-yellow-400 font-bold text-lg mb-2">₹{price}</p>
                  <button
                    onClick={() => handleAddToCart(_id)}
                    className="mt-auto w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-600 text-white hover:bg-gray-700 disabled:opacity-30"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-600 text-white hover:bg-gray-700 disabled:opacity-30"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  const isGap = prev && page - prev > 1;

                  return (
                    <Fragment key={page}>
                      {isGap && (
                        <span className="px-2 py-1 text-gray-500 select-none">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === page
                            ? "bg-yellow-400 text-black font-bold border-yellow-400"
                            : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    </Fragment>
                  );
                })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-600 text-white hover:bg-gray-700 disabled:opacity-30"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-600 text-white hover:bg-gray-700 disabled:opacity-30"
              >
                Last
              </button>
            </div>
          )}

          {/* Modal View */}
          {selectedProduct && (
            <Dialog
              open={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            >
              <div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-contain rounded mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-sm text-gray-400">{selectedProduct.description}</p>
                <p className="text-lg text-yellow-400 mt-3 mb-4">
                  ₹{selectedProduct.price}
                </p>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </Dialog>
          )}

          {/* No Products */}
          {products.length === 0 && !loading && (
            <p className="text-center mt-6 text-gray-500">No products available.</p>
          )}
        </>
      )}
    </div>
  );
}
