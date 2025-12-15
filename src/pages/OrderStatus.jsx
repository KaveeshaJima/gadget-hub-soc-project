import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, orderId } = location.state || {};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
            
            {orderId && (
              <p className="mt-2 text-sm text-gray-600">
                Order ID: #{orderId}
              </p>
            )}

            <div className="mt-6">
              <p className="text-gray-700 leading-relaxed">
                {message || 'Your order has been successfully placed. We will contact you with delivery details once we receive quotations from our distributors.'}
              </p>
            </div>

            {/* Order Process Steps */}
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800 mr-3 mt-0.5">
                    1
                  </span>
                  <span>We send your order to our distributors for quotations</span>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800 mr-3 mt-0.5">
                    2
                  </span>
                  <span>Distributors provide pricing and delivery estimates</span>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800 mr-3 mt-0.5">
                    3
                  </span>
                  <span>We select the best offer and confirm your order</span>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800 mr-3 mt-0.5">
                    4
                  </span>
                  <span>You receive final pricing and delivery details</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate('/home')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                View Order Details
              </button>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Have questions? Contact us at{' '}
                <a href="mailto:support@gadgethub.com" className="text-orange-600 hover:text-orange-500">
                  support@gadgethub.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderStatus;
