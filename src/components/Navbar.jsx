import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, removeCurrentUser } from '../services/authService';

const Navbar = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    removeCurrentUser();
    navigate('/');
  };

  return (
    <nav className="bg-orange-600 text-white px-6 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-orange-200 transition-colors">
          GadgetHub
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/home" className="hover:text-orange-200 transition-colors font-medium">
            Home
          </Link>
          
          {currentUser?.userType === 'distributor' && (
            <Link to="/distributor-dashboard" className="hover:text-orange-200 transition-colors font-medium">
              Dashboard
            </Link>
          )}
          
          {currentUser?.userType === 'customer' && (
            <>
              <Link to="/checkout" className="hover:text-orange-200 transition-colors font-medium">
                Checkout
              </Link>
               <Link to="/myOrders" className="hover:text-orange-200 transition-colors font-medium">
                My Orders
              </Link>
              
              {/* Cart Icon */}
              <div className="relative">
                <Link to="/cart" className="flex items-center space-x-1 hover:text-orange-200 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </>
          )}
          
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">
                Welcome, {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
