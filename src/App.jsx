// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import DistributorDashboard from './pages/DistributorDashboard';
import MyOrders from './components/MyOrders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/distributor-dashboard" element={<DistributorDashboard />} />
        <Route path="/myOrders" element={<MyOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
