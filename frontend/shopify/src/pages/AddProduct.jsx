import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.user?.token;

      if (!token) {
        toast.error("Not authorized. Please log in as admin.");
        return;
      }

      // ✅ FIXED: Use full backend URL if ports differ
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added successfully!");
      navigate("/admindashboard");
    } catch (err) {
      console.error("Add product failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to add product";
      toast.error(errorMsg);
    }
  };


  return (
    <div className="min-h-screen pt-[72px] px-4 py-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans">
      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          🛒 Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          ></textarea>
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-2.5 rounded shadow-lg transition-all duration-200"
          >
            + Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
