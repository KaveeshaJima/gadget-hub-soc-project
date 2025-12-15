import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllProducts, searchProducts } from '../services/productService';
import { addToCart, getCartByCustomer } from '../services/cartService';
import { getCurrentUser } from '../services/authService';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});

  const currentUser = getCurrentUser();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading products...');
      const data = await fetchAllProducts();
      console.log('Products loaded:', data);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError('Failed to load products. Please check if the server is running.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to prevent infinite loops

  const loadCart = useCallback(async () => {
    if (!currentUser || currentUser.userType !== 'customer') return;
    
    try {
      console.log('Loading cart for user:', currentUser);
      const customerId = currentUser.customerId || currentUser.CustomerId;
      const items = await getCartByCustomer(customerId);
      console.log('Cart loaded:', items);
      setCartItems(items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      // Don't show error for cart loading, just set empty array
      setCartItems([]);
    }
  }, [currentUser?.customerId || currentUser?.CustomerId]); // Only depend on customerId

  const handleSearch = useCallback(async (term) => {
    if (!term || term.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    try {
      console.log('Searching for:', term);
      const searchResults = await searchProducts(term);
      setFilteredProducts(searchResults);
    } catch (err) {
      console.error("Search failed:", err);
      // Fallback to client-side search
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(term.toLowerCase()) ||
        product.description?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products]);

  // Load initial data - only run once
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (isMounted) {
        await loadProducts();
        
        if (currentUser?.userType === 'customer' && isMounted) {
          await loadCart();
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Handle search separately
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const handleAddToCart = async (product) => {
    if (!currentUser || currentUser.userType !== 'customer') {
      setError('Please login as a customer to add items to cart');
      return;
    }

    const productId = product.id;
    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      const customerId = currentUser.customerId || currentUser.CustomerId;
      const cartData = {
        customerId: customerId,
        productId: productId,
        quantity: 1
      };

      console.log('Adding to cart:', cartData);
      await addToCart(cartData);
      
      // Reload cart
      await loadCart();
      
      setError(null);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // For now, just remove from local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const updateCartItemQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Add retry function
  const retryLoadProducts = () => {
    setError(null);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemCount={getTotalItems()} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to GadgetHub
            </h1>
            <p className="text-xl mb-8">
              Discover amazing gadgets from top distributors
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button 
                  onClick={() => handleSearch(searchTerm)}
                  className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Toggle Button - Only show for customers */}
      {currentUser?.userType === 'customer' && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed top-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          🛒 {getTotalItems() > 0 && (
            <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-1">
              {getTotalItems()}
            </span>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={retryLoadProducts}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 && !error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No products available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={`product-${product.id}-${product.name}`} // Better key to prevent React issues
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                isLoading={addingToCart[product.id] || false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && currentUser?.userType === 'customer' && (
        <Cart
          cartItems={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateCartItemQuantity}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default HomePage;