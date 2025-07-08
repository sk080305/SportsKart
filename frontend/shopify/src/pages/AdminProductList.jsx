import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const backendURL = "http://localhost:5000";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await axios.get(`${backendURL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await axios.delete(`${backendURL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-[72px] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 py-12 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Row with Add Button and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <button
  onClick={() => navigate("/admin/products/add")}
  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 transition-all duration-200 px-6 py-2.5 rounded-full text-white font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 flex items-center gap-2"
>
  <span className="text-lg">+</span> Add Product
</button>


          <input
            type="text"
            placeholder="🔍︎ Search by name or category..."
            className="w-full md:w-80 px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  role="admin"
                  onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
                  onDelete={deleteProduct}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-6 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-800 border border-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                ◀ 
              </button>
              <span className="text-white font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-800 border border-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
