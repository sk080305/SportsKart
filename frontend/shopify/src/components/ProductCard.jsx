import React, { useState, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

const ProductCard = ({ product, role = "guest", onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { _id, name, price, category, imageUrl, description } = product;
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        alert("Please login to add to cart");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: _id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
      alert("Failed to add to cart");
    }
  };

  return (
    <>
      <div className="bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
        {/* Image */}
        <div
          className="w-full h-56 bg-white flex items-center justify-center cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={
              imageUrl?.startsWith("http")
                ? imageUrl
                : `http://localhost:5000/${imageUrl || "placeholder.png"}`
            }
            alt={name}
            className="max-h-52 w-full object-contain p-2"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-green-400 mb-1">{name}</h3>
          <p className="text-sm text-gray-300 capitalize mb-1">
            {category || "Uncategorized"}
          </p>

          {description && (
            <p className="text-sm text-gray-400 mb-2 line-clamp-3">
              {description.length > 100
                ? description.slice(0, 100) + "..."
                : description}
            </p>
          )}

          <p className="text-lg font-bold text-yellow-300 mt-auto">₹{price}</p>

          {/* Buttons */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {role === "admin" && (
              <>
                <button
                  onClick={() => onEdit(_id)}
                  className="px-3 py-1 text-sm rounded bg-yellow-600 hover:bg-yellow-700"
                >
                  ✎ Edit
                </button>
                <button
                  onClick={() => onDelete(_id)}
                  className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </>
            )}

            {role === "user" && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
              >
                Add to Cart 🛒
              </button>
            )}

            {role === "guest" && (
              <Link
                to="/login"
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm font-semibold"
              >
                Login to Buy
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
                <img
                  src={
                    imageUrl?.startsWith("http")
                      ? imageUrl
                      : `http://localhost:5000/${imageUrl || "placeholder.png"}`
                  }
                  alt={name}
                  className="w-full h-[500px] object-contain bg-black"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div className="p-4 text-white">
                  <Dialog.Title className="text-xl font-bold">
                    {name}
                  </Dialog.Title>
                  <p className="text-sm text-gray-400 mt-1">{description}</p>
                  <p className="text-lg font-semibold text-yellow-400 mt-3">
                    ₹{price}
                  </p>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProductCard;
