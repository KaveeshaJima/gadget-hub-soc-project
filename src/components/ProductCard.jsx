import React from 'react';

const BASE_API_URL = 'https://localhost:7154'; // Update to your backend URL

const ProductCard = ({ product, onAddToCart, isLoading = false }) => {
  const handleImageError = (e) => {
    if (!e.target.dataset.fallback) {
      e.target.src = 'https://placehold.co/300x200?text=No+Image';
      e.target.dataset.fallback = 'true';
    }
  };

  // Enhanced image URL construction for your Program.cs configuration
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://placehold.co/300x200?text=No+Image';
    }

    // Check if it's already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Your Program.cs serves files from root/uploads directory at /uploads path
    // Database stores: "filename.png" (just the filename)
    // URL should be: "https://localhost:7154/uploads/filename.png"
    
    const baseUrl = BASE_API_URL.replace(/\/+$/, '');
    
    // If the path already includes "uploads/", use it as is
    if (imagePath.includes('uploads/')) {
      return `${baseUrl}/${imagePath}`;
    }
    
    // Otherwise, add the uploads path
    return `${baseUrl}/uploads/${imagePath}`;
  };

  const imageUrl = getImageUrl(product.image);

  // Debug logging (remove in production)
  console.log('Product image path:', product.image);
  console.log('Constructed image URL:', imageUrl);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
            title="Add to Cart"
          >
            {isLoading ? (
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-orange-600 font-semibold">
            {product.price ? `$${product.price}` : 'Price on request'}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;