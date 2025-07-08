import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products`);
      const product = res.data.find((p) => p._id === id);
      if (product) setFormData(product);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || user?.user?.token;

  if (!token) {
    alert("Not authenticated. Please log in again.");
    return navigate("/login");
  }

  try {
    await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Product updated successfully!");
    navigate("/adminproductlist");
  } catch (err) {
    toast.error("Update failed:", err);
    alert("Failed to update product.");
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <input name="name" value={formData.name} onChange={handleChange} className="border w-full mb-2 p-2" />
      <textarea name="description" value={formData.description} onChange={handleChange} className="border w-full mb-2 p-2" />
      <input name="price" type="number" value={formData.price} onChange={handleChange} className="border w-full mb-2 p-2" />
      <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="border w-full mb-2 p-2" />
      <input name="category" value={formData.category} onChange={handleChange} className="border w-full mb-2 p-2" />
      <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="border w-full mb-2 p-2" />
      <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
    </form>
  );
};

export default EditProduct;
