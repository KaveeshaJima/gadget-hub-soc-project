import axios from 'axios';

const BASE_URL = 'https://localhost:7154/api/order';

// Make booking/confirm order
export const makeBooking = async (orderData) => {
  const response = await axios.post(`${BASE_URL}/makeBooking`, orderData);
  return response.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const response = await axios.get(`${BASE_URL}/${orderId}`);
  return response.data;
};

// Get orders by customer ID
export const getOrdersByCustomer = async (customerId) => {
  const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
  return response.data;
};

// Get all orders
export const getAllOrders = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};

export const getMyOrders = async (customerId) => {
  try{
    const response = await axios.get(`${BASE_URL}/myOrders/${customerId}`);
    return response.data;

  }catch(e){
    console.error('Error fetching my orders:', e);
    throw e;
  }
};

