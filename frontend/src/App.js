import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import AdminNavBar from './components/AdminNavBar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryProducts from './pages/CategoryProducts';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/MyOrders';
import WishlistPage from './pages/WishlistPage';
import ContactUs from './pages/ContactUs';
import CategorySearchPage from './pages/CategorySearchPage';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  return (
    <div>
      {isAdmin ? <AdminNavBar /> : <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin-dashboard" : "/"} /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin-dashboard" : "/"} /> : <Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/category/:name" element={<CategoryProducts />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/contact" element={<ContactUs />} /> 
        <Route path="/category/byname" element={<CategorySearchPage />} />
        <Route 
          path="/admin-dashboard" 
          element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;