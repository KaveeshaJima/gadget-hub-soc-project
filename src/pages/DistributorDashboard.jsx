import React, { useEffect, useState } from 'react';
import { getConfirmedOrderItems } from '../services/cartService';
import { getQuotationsForItem, submitQuotation } from '../services/quotationService';
import { getCurrentUser } from '../services/authService';
import Navbar from '../components/Navbar';

const DistributorDashboard = () => {
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [quotations, setQuotations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quotationForm, setQuotationForm] = useState({
    price: '',
    estimatedDeliveryTime: '',
    quantity: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadConfirmedItems();
  }, []);

  const loadConfirmedItems = async () => {
    try {
      setLoading(true);
      const items = await getConfirmedOrderItems();
      setConfirmedItems(items);
      
      // Load quotations for each item
      const quotationsData = {};
      for (const item of items) {
        try {
          const itemQuotations = await getQuotationsForItem(item.id);
          quotationsData[item.id] = itemQuotations;
        } catch (err) {
          console.error(`Failed to load quotations for item ${item.id}:`, err);
          quotationsData[item.id] = [];
        }
      }
      setQuotations(quotationsData);
    } catch (err) {
      setError('Failed to load confirmed items');
      console.error('Error loading confirmed items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuotationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmitting(true);
    try {
      const quotationData = {
        price: parseFloat(quotationForm.price),
        estimatedDeliveryTime: new Date(quotationForm.estimatedDeliveryTime),
        quantity: parseInt(quotationForm.quantity),
        distributorId: currentUser.distributorId || currentUser.DistributorId,
        orderItemId: selectedItem.id
      };

      await submitQuotation(quotationData);
      
      // Reload quotations for this item
      const updatedQuotations = await getQuotationsForItem(selectedItem.id);
      setQuotations(prev => ({
        ...prev,
        [selectedItem.id]: updatedQuotations
      }));

      // Reset form
      setQuotationForm({
        price: '',
        estimatedDeliveryTime: '',
        quantity: ''
      });
      setSelectedItem(null);
    } catch (err) {
      setError('Failed to submit quotation');
      console.error('Error submitting quotation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getQuotationStatus = (itemId) => {
    const itemQuotations = quotations[itemId] || [];
    const myQuotation = itemQuotations.find(q => 
      q.distributorId === (currentUser.distributorId || currentUser.DistributorId)
    );
    
    if (!myQuotation) return 'Not submitted';
    if (myQuotation.status === 'approved') return 'Approved';
    if (myQuotation.status === 'rejected') return 'Rejected';
    return 'Pending';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading distributor dashboard...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {currentUser?.name || 'Distributor'}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Confirmed Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Confirmed Orders
              </h2>
              
              {confirmedItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No confirmed orders</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No confirmed orders are available at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {confirmedItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.itemName}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Status: {item.status}</p>
                          <p className="text-sm text-gray-600">
                            Quotation Status: {getQuotationStatus(item.id)}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Submit Quotation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quotation Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Submit Quotation
              </h2>
              
              {selectedItem ? (
                <form onSubmit={handleQuotationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item: {selectedItem.itemName}
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price per unit
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      required
                      value={quotationForm.price}
                      onChange={(e) => setQuotationForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter price per unit"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Available Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      required
                      value={quotationForm.quantity}
                      onChange={(e) => setQuotationForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter available quantity"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      id="deliveryTime"
                      required
                      value={quotationForm.estimatedDeliveryTime}
                      onChange={(e) => setQuotationForm(prev => ({ ...prev, estimatedDeliveryTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quotation'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(null);
                        setQuotationForm({ price: '', estimatedDeliveryTime: '', quantity: '' });
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select an item</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose an item from the confirmed orders to submit a quotation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DistributorDashboard; 