import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService';
import Navbar from '../components/Navbar';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    if (!customerId) {
      setError('No customer ID found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMyOrders(customerId);
        setOrders(response || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const getStatusColor = (status) => {
    const statusColors = {
      'confirmed': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'confirmed': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      'pending': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      'processing': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      'shipped': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
        </svg>
      ),
      'delivered': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      'cancelled': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    };
    return statusIcons[status?.toLowerCase()] || statusIcons['pending'];
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatDeliveryTime = (deliveryTime) => {
    if (!deliveryTime) return 'Not specified';
    
    // If it's already a formatted string, return as is
    if (typeof deliveryTime === 'string') {
      return deliveryTime;
    }
    
    // If it's a number, assume it's minutes and convert appropriately
    if (typeof deliveryTime === 'number') {
      if (deliveryTime < 60) {
        return `${deliveryTime} minutes`;
      } else if (deliveryTime < 1440) {
        const hours = Math.floor(deliveryTime / 60);
        const mins = deliveryTime % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
      } else {
        const days = Math.floor(deliveryTime / 1440);
        return `${days} day${days !== 1 ? 's' : ''}`;
      }
    }
    
    return deliveryTime;
  };

  const handleRetry = () => {
    if (!customerId) return;
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMyOrders(customerId);
        setOrders(response || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  };

  const getTotalOrderValue = (orders) => {
    return orders.reduce((total, order) => {
      const price = parseFloat(order.price) || 0;
      return total + price;
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your orders...</p>
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage your order history</p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="text-red-700 hover:text-red-900 font-medium underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Orders List */}
            {orders.length === 0 && !error ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="mt-6 text-xl font-medium text-gray-900">No orders found</h2>
                <p className="mt-2 text-gray-600">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <button
                  onClick={() => window.location.href = '/home'}
                  className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{formatPrice(order.price)}</p>
                          <p className="text-sm text-gray-600">
                            {order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Delivery Address */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                            Delivery Address
                          </h4>
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-gray-700">{order.address}</p>
                          </div>
                        </div>

                        {/* Delivery Time */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                            Delivery Time
                          </h4>
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-700">{formatDeliveryTime(order.deliveryTime)}</p>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                            Products ({order.products?.length || 0})
                          </h4>
                          <div className="space-y-2">
                            {order.products && order.products.length > 0 ? (
                              order.products.map((product, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                                  <span className="text-gray-700 capitalize">{product}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 italic">No products listed</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Order ID: {order.id}
                          </div>
                          <div className="flex space-x-3">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                              View Details
                            </button>
                            {order.status?.toLowerCase() === 'confirmed' && (
                              <button className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-md hover:bg-orange-200 transition-colors duration-200">
                                Track Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Summary */}
            {orders.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {orders.filter(order => order.status?.toLowerCase() === 'confirmed').length}
                    </p>
                    <p className="text-sm text-gray-600">Confirmed</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(order => order.status?.toLowerCase() === 'processing').length}
                    </p>
                    <p className="text-sm text-gray-600">Processing</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">
                      {orders.reduce((total, order) => total + (order.products?.length || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Items</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {formatPrice(getTotalOrderValue(orders))}
                    </p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}