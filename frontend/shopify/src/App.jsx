// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AddProduct from './pages/AddProduct';
import AdminProductList from './pages/AdminProductList';
import UpdateProduct from './pages/UpdateProduct';
import AdminUserList from './pages/AdminUserList';
import GuestProductList from './pages/GuestProductList';
import UserWishlist from './pages/Wishlist';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartPage from './pages/CartPage';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';
import AdminOrders from './pages/AdminOrders';


function App() {
  const { user, loading } = useAuth();

  const getHomeComponent = () => {
    if (!user) return <Home />;
    if (user.role === 'admin') return <AdminHome />;
    return <UserHome />;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Router>
        <Navbar /> {/* ✅ Always render */}
        <Routes>
          <Route path="/" element={getHomeComponent()} />
          <Route path="/guestproductlist" element={<GuestProductList />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/wishlist" element={<UserWishlist />} />
          <Route path="/userprofile" element={<UserProfile/>}/>
          

          <Route
  path="/cart"
  element={
    <ProtectedRoute requiredRole="user">
      <CartPage />
    </ProtectedRoute>
  }
  
/>

<Route
  path="/orders"
  element={
    <ProtectedRoute requiredRole="user">
      <UserOrders />
    </ProtectedRoute>
  }
/>




          {/* Protected Routes */}
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
  path="/adminorders"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminOrders />
    </ProtectedRoute>
  }
/>
          <Route
            path="/adminproductlist"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <UpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminuserlist"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserList />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
