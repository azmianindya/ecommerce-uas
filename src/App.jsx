import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const location = useLocation();
  
  // Hide header and footer on login pages AND admin dashboard
  const isLoginPage = location.pathname === '/login' || location.pathname === '/admin';
  const isAdminDashboard = location.pathname.startsWith('/admin-dashboard');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="app">
      {/* Tidak render Header di halaman login DAN admin dashboard */}
      {!isLoginPage && !isAdminDashboard && <Header cartItems={cartItems} />}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="products" element={<Products addToCart={addToCart} />} />
          <Route path="product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route 
            path="cart" 
            element={
              <Cart 
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            } 
          />
          <Route 
            path="checkout" 
            element={
              <Checkout 
                cartItems={cartItems}
                clearCart={clearCart}
              />
            } 
          />
          <Route path="admin" element={<Login />} />
          <Route path="login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-dashboard/products" element={<AdminDashboard />} />
          <Route path="admin-dashboard/cart" element={<AdminDashboard />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Tidak render Footer di halaman login DAN admin dashboard */}
      {!isLoginPage && !isAdminDashboard && <Footer />}
    </div>
  );
}

export default App;