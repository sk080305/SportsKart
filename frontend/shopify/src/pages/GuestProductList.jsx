import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function GuestProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">
        Explore Sports Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map(({ _id, name, price, imageUrl }) => (
          <div
            key={_id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="h-48 w-full overflow-hidden rounded-t-lg">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-blue-700">{name}</h2>
              <p className="mt-2 text-green-700 font-semibold text-lg">₹{price}</p>
              <Link
                to="/login"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Login to Buy
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No products available.</p>
      )}
    </div>
  );
}
