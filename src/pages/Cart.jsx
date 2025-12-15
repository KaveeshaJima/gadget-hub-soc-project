import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartByCustomer, removeFromCart } from '../services/cartService';
import { getCurrentUser } from '../services/authService';
import Navbar from '../components/Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = getCurrentUser();

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const customerId = currentUser.customerId || currentUser.CustomerId;
      
      if (!customerId) {
        throw new Error('Customer ID not found');
      }
      
      const items = await getCartByCustomer(customerId);
      setCartItems(items || []); // Ensure items is always an array
    } catch (err) {
      setError('Failed to load cart items. Please try again later.');
      console.error('Error loading cart:', err);
      setCartItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentUser?.customerId, currentUser?.CustomerId]); // Fixed dependencies

  useEffect(() => {
    if (!currentUser || currentUser.userType !== 'customer') {
      navigate('/login');
      return;
    }
    
    // Only load cart once when component mounts or customer ID changes
    loadCart();
  }, [currentUser?.customerId, currentUser?.CustomerId, navigate]); // Removed loadCart from dependencies

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Add retry functionality
  const handleRetry = () => {
    loadCart();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar cartItemCount={getTotalItems()} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <div className="flex justify-between items-center">
                  <span>{error}</span>
                  <button
                    onClick={handleRetry}
                    className="text-red-700 hover:text-red-900 font-medium underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {cartItems.length === 0 && !error ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
                <p className="mt-2 text-gray-600">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Cart Items ({getTotalItems()})
                  </h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.itemName}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Status: {item.status}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Item ID: {item.id}</span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-900">Total Items:</span>
                    <span className="text-lg font-medium text-gray-900">{getTotalItems()}</span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/home')}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;