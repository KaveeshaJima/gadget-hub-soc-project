import axios from 'axios';

const BASE_URL = 'http://localhost:5129/api/product'; // Updated to match your backend port

// Fetch all products
export const fetchAllProducts = async () => {
  const res = await axios.get(`${BASE_URL}/all`);
  return res.data;
};

// Search products by name
export const searchProducts = async (name) => {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { name }
  });
  return res.data;
};

// Add a new product (with image)
export const addProduct = async (formData) => {
  const res = await axios.post(`${BASE_URL}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// Update product by ID (expects plain JSON body)
export const updateProduct = async (id, productData) => {
  const res = await axios.put(`${BASE_URL}/update/${id}`, productData);
  return res.data;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
