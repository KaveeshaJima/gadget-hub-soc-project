import axios from 'axios';

const BASE_URL = 'http://localhost:5129/api/cart';

// Configure axios with timeout and retry logic
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // Return a more descriptive error
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      throw new Error('Resource not found.');
    } else {
      throw error;
    }
  }
);

// Add item to cart
export const addToCart = async (cartData) => {
  try {
    const response = await axiosInstance.post('/add', cartData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to remove item from cart: ${error.message}`);
  }
};

// Get cart by customer ID with better error handling
export const getCartByCustomer = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    const response = await axiosInstance.get(`/customer/${customerId}`);
    return response.data || []; // Ensure we always return an array
  } catch (error) {
    // If it's a 404, return empty array instead of throwing
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error(`Failed to load cart: ${error.message}`);
  }
};

// Get cart by distributor ID
export const getCartByDistributor = async (distributorId) => {
  try {
    if (!distributorId) {
      throw new Error('Distributor ID is required');
    }
    
    const response = await axiosInstance.get(`/distributor/${distributorId}`);
    return response.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error(`Failed to load distributor cart: ${error.message}`);
  }
};

// Get confirmed order items
export const getConfirmedOrderItems = async () => {
  try {
    const response = await axiosInstance.get('/confirmed');
    return response.data || [];
  } catch (error) {
    throw new Error(`Failed to load confirmed orders: ${error.message}`);
  }
};

// Submit quotation
