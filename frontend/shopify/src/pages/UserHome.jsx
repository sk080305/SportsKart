import React, { useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Helmet } from "react-helmet-async";

export default function UserHome() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/products");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

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

  const renderedSlides = useMemo(() => {
    return products.map((product) => (
      <SwiperSlide key={product._id}>
        <ProductCard product={product} role="user" />
      </SwiperSlide>
    ));
  }, [products]);

  return (
    <div className="bg-gray-950 text-white font-sans">
      {/* SEO Metadata */}
      <Helmet>
        <title>SportsKart | Home</title>
        <meta
          name="description"
          content="Shop premium sports gear and apparel for cricket, football, fitness, and more at SportsKart. Free shipping, COD, and easy returns."
        />
      </Helmet>

      {/* Promo Bar */}
      <section className="bg-yellow-500 overflow-hidden py-3 mt-12">
        <div className="animate-marquee whitespace-nowrap text-black text-sm md:text-base font-semibold tracking-wider flex gap-12">
          <span>🚚 Free Shipping on orders above ₹999 </span>
          <span>| 💰 Cash On Delivery Available </span>
          <span>| 🔁 7-Day Return Policy </span>
          <span>| 🏆 Trusted by Athletes Nationwide </span>
          <span>| 🔥 Shop Now & Save Big</span>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-black h-screen">
        <img
          src="/images/sports-tools.jpg"
          alt="Sports gear and accessories"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          width="1600"
          height="900"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-xl mb-4">
              Welcome Back, Champion!
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Get your gear ready and conquer the field with SportsKart.
            </p>
          </motion.div>
        </div>
      </section>

      <SlantDivider color="#facc15" flip />

      {/* Categories */}
      <section className="py-20 bg-gray-950">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explore Categories
        </h2>
        <div className="grid gap-8 px-6 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Cricket", image: "/images/categories/cricket.webp" },
            { name: "Football", image: "/images/categories/football.webp" },
            { name: "Badminton", image: "/images/categories/badminton.webp" },
            { name: "Fitness", image: "/images/categories/fitness.webp" },
            { name: "Tennis", image: "/images/categories/tennis.webp" },
          ].map((cat, i) => (
            <div
              key={i}
              className="relative h-64 rounded-xl overflow-hidden shadow-lg group border border-gray-800"
            >
              <img
                src={cat.image}
                alt={`${cat.name} equipment`}
                loading="lazy"
                width="400"
                height="300"
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

      {/* Product Carousel */}
      <section className="py-16 px-6 max-w-7xl mx-auto bg-gray-900">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Recommended for You
        </motion.h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10">
          Hand-picked gear based on your interests and recent activity.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-md bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {renderedSlides}
          </Swiper>
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
