import axios from 'axios';

const BASE_URL = 'https://localhost:7154/api/quotation';

// Submit quotation
export const submitQuotation = async (quotationData) => {
  const response = await axios.post(`${BASE_URL}/respond`, quotationData);
  return response.data;
};

// Get quotations for order item
export const getQuotationsForItem = async (orderItemId) => {
  const response = await axios.get(`${BASE_URL}/orderItem/${orderItemId}`);
  return response.data;
};

// Get all quotations
export const getAllQuotations = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};

// Get quotations by distributor
export const getQuotationsByDistributor = async (distributorId) => {
  const response = await axios.get(`${BASE_URL}/distributor/${distributorId}`);
  return response.data;
}; 