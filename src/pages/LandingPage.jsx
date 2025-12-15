import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-300 to-orange-400 rounded-full opacity-15 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-10 animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Mouse Follower Effect */}
      <div 
        className="fixed w-6 h-6 bg-orange-400 rounded-full opacity-20 pointer-events-none z-10 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(1)',
        }}
      ></div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-20">
        <div className={`max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 bg-white/80 backdrop-blur-sm p-8 md:p-16 shadow-2xl rounded-3xl border border-orange-100 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce">
                  🚀 New Products Available
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
                Discover Top Tech at{' '}
                <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent animate-pulse">
                  Gadget Hub
                </span>
              </h1>
            </div>
            
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              Your one-stop destination for the latest gadgets from trusted distributors. 
              Compare prices, shop with confidence, and enjoy lightning-fast doorstep delivery.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Best Prices</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Trusted Quality</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">24/7 Support</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              
              <Link
                to="/login"
                className="group bg-white hover:bg-gray-50 text-gray-700 hover:text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 text-center border-2 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sign In
                <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300 ml-2">→</span>
              </Link>
              
              <Link
                to="/home"
                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  🛍️ Shop Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">1000+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative group">
              {/* Floating Elements Around Image */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute -top-2 right-8 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute bottom-4 -left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-ping opacity-60"></div>
              
              {/* Image Container */}
              <div className="relative bg-gradient-to-br from-orange-100 to-orange-200 p-8 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img
                  src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/media/7edb58f07be680dd6a7f7865d2aa3553.gif"
                  alt="Gadget Illustration"
                  className="relative w-full max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-lg transform group-hover:rotate-2 transition-all duration-500"
                />
                
                {/* Floating Cards */}
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-orange-200 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-8 bg-white p-3 rounded-xl shadow-lg border border-orange-200 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}>
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-500 text-sm">⭐</span>
                    <span className="text-sm font-medium text-gray-700">5.0 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="url(#gradient)" fillOpacity="0.1"></path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}