import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function GuestHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use requestIdleCallback if available for smoother initial load
  useEffect(() => {
    const fetchProducts = () => {
      axios
        .get("http://localhost:5000/api/products")
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Failed to fetch products", err))
        .finally(() => setLoading(false));
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchProducts);
    } else {
      setTimeout(fetchProducts, 300);
    }
  }, []);

  const SlantDivider = ({ color = "#facc15", flip = false }) => (
    <div
      className="w-full h-12"
      style={{
        background: color,
        clipPath: flip
          ? "polygon(0 0, 100% 100%, 100% 0, 0% 0)"
          : "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)",
      }}
    />
  );

  return (
    <div className="bg-gray-950 text-white font-sans">
      <section className="bg-yellow-500 overflow-hidden py-3 mt-12">
        <div className="animate-marquee whitespace-nowrap text-black text-sm md:text-base font-semibold tracking-wider flex gap-12">
          <span>🚚| Free Shipping on orders above ₹999</span>
          <span>|💰| Cash On Delivery Available</span>
          <span>|🔁| 7-Day Return Policy</span>
          <span>|🏆| Trusted by Athletes Nationwide</span>
          <span>|🔥| Shop Now & Save Big</span>
        </div>
      </section>

      


      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/images/sports-tools.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-xl mb-4">
              Unleash the Athlete in You
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Gear up with premium sports equipment from SportsKart and dominate the game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Promo Marquee
      <section className="bg-yellow-500 overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap text-black text-sm md:text-base font-semibold tracking-wider flex gap-12">
          <span>🚚 Free Shipping on orders above ₹999</span>
          <span>💰 Cash On Delivery Available</span>
          <span>🔁 7-Day Return Policy</span>
          <span>🏆 Trusted by Athletes Nationwide</span>
          <span>🔥 Shop Now & Save Big</span>
        </div>
      </section> */}

      <SlantDivider color="#facc15" flip />

      {/* Categories */}
      <section className="py-20 bg-gray-950">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid gap-8 px-6 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Cricket", image: "/images/categories/cricket.jpg" },
            { name: "Football", image: "/images/categories/football.jpg" },
            { name: "Badminton", image: "/images/categories/badminton.jpg" },
            { name: "Fitness", image: "/images/categories/fitness.jpg" },
            { name: "Tennis", image: "/images/categories/tennis.jpg" },
          ].map((cat, i) => (
            <div
              key={i}
              className="relative h-64 rounded-xl overflow-hidden shadow-lg group border border-gray-800"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-2xl font-bold tracking-wide text-white drop-shadow-xl">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SlantDivider color="#1f2937" />

      {/* Product Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto bg-gray-900">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Trending Products
        </motion.h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10">
          Explore top-rated gear trusted by athletes and fitness lovers.
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-md bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} role="guest" />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No products found.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black text-center py-6 border-t border-gray-800 mt-20">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SportsKart. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
