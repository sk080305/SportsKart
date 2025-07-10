import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaTachometerAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY.current || currentScrollY < 10);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = user?.token || user?.user?.token;
      if (!token) return;
      try {
        const wishlistRes = await axios.get('/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistCount(wishlistRes.data.length || 0);

        const cartRes = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartCount(cartRes.data.items?.length || 0);
      } catch (err) {
        console.error('Failed to fetch cart/wishlist counts', err.message);
      }
    };
    fetchCounts();
  }, [user]);

  if (loading) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full z-50 bg-gray-900/90 backdrop-blur-md py-2 shadow-md text-white"
        >
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="images/Logo.webp" alt="logo" className="h-8 w-8" />
              <span className="text-2xl font-bold tracking-wide text-cyan-400">
                SportsKart
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base">
              {user?.role === 'user' && (
                <>
                  <Link to="/" className="flex items-center gap-1 hover:text-yellow-300">
                    <FaHome /> Home
                  </Link>
                  <Link to="/userdashboard" className="flex items-center gap-1 hover:text-yellow-300">
                    <FaTachometerAlt /> Dashboard
                  </Link>
                  <Link
  to="/wishlist"
  className="relative flex items-center hover:text-pink-300"
  aria-label="Wishlist"
>
  <FaHeart />
  {wishlistCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
      {wishlistCount}
    </span>
  )}
</Link>

<Link
  to="/cart"
  className="relative flex items-center hover:text-yellow-200"
  aria-label="Cart"
>
  <FaShoppingCart />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full shadow">
      {cartCount}
    </span>
  )}
</Link>


                  {/* User Dropdown */}
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="text-white font-medium hover:text-yellow-300">
                      👤 {user.name || user.user?.name}
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-44 bg-white text-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/userprofile"
                              className={`${
                                active ? 'bg-blue-100 text-blue-900' : ''
                              } group flex items-center w-full px-3 py-2 text-sm rounded`}
                            >
                              🧾 My Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/orders"
                              className={`${
                                active ? 'bg-blue-100 text-blue-900' : ''
                              } group flex items-center w-full px-3 py-2 text-sm rounded`}
                            >
                              🚚 My Orders
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? 'bg-red-100 text-red-700' : ''
                              } group flex items-center w-full px-3 py-2 text-sm rounded`}
                            >
                              🔓 Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <Link to="/" className="flex items-center gap-1 hover:text-yellow-300">
                    <FaHome /> Home
                  </Link>
                  
                  <span className="text-sm font-medium">👤 {user.name || user.user?.name}</span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link to="/login" className="hover:text-yellow-300">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-yellow-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
