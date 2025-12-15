import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartByCustomer } from '../services/cartService';
import { makeBooking } from '../services/orderService';
import { getCurrentUser } from '../services/authService';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deliveryForm, setDeliveryForm] = useState({
    address: '',
    phone: '',
    notes: ''
  });

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
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Only load cart once when component mounts or customer ID changes
    loadCart();
  }, [currentUser?.customerId, currentUser?.CustomerId, navigate]); // Removed loadCart from dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!deliveryForm.address.trim()) {
      setError('Please provide a delivery address');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const customerId = currentUser.customerId || currentUser.CustomerId;
      
      const orderData = {
        customerId: customerId,
        address: deliveryForm.address,
        phone: deliveryForm.phone,
        notes: deliveryForm.notes
      };

      await makeBooking(orderData);
      
      // Redirect to order confirmation
      navigate('/order-status', { 
        state: { 
          message: 'Order placed successfully! We will contact you with delivery details.',
          orderId: Date.now() // In real app, this would come from the API
        }
      });
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Add retry functionality
  const handleRetry = () => {
    loadCart();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                {cartItems.length === 0 && !error ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add some items to your cart before checkout.
                    </p>
                    <button
                      onClick={() => navigate('/home')}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.itemName}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Status: {item.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Item ID: {item.id}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-900">Total Items:</span>
                        <span className="text-lg font-medium text-gray-900">{getTotalItems()}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
                
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      required
                      value={deliveryForm.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your complete delivery address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={deliveryForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="2"
                      value={deliveryForm.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any special instructions for delivery"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Order Process</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Your order will be sent to our distributors for quotations</li>
                      <li>• We'll select the best offer based on price and delivery time</li>
                      <li>• You'll receive confirmation with final pricing and delivery details</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || cartItems.length === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;