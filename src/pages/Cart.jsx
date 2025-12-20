import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 500000 || subtotal === 0 ? 0 : 15000;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.11;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = calculateTotal();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="cart-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Keranjang Belanja</h1>
          <p className="page-subtitle">
            Review produk yang akan Anda beli
          </p>
        </div>

        <div className="cart-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-center">
              <div className="empty-cart-icon">🛒</div>
              <h2 className="empty-cart-title">Keranjang Belanja Kosong</h2>
              <p className="empty-cart-message">
                Belum ada produk di keranjang belanja Anda. Yuk, mulai belanja!
              </p>
              <div className="empty-cart-actions">
                <button 
                  onClick={handleContinueShopping}
                  className="btn btn-primary btn-large"
                >
                  🛍️ Mulai Belanja
                </button>
                <Link to="/" className="btn btn-outline btn-large">
                  ← Kembali ke Beranda
                </Link>
              </div>
            </div>
          ) : (
            <div className="cart-centered-layout">
              {/* Order Summary - DI ATAS */}
              <div className="order-summary-top">
                <h2 className="summary-title">Ringkasan Belanja</h2>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="row-label">Subtotal ({cartItems.length} produk)</span>
                    <span className="row-value">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span className="row-label">Biaya Pengiriman</span>
                    <span className={`row-value ${shipping === 0 ? 'free' : ''}`}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                  </div>
                  
                  <div className="summary-row">
                    <span className="row-label">PPN (11%)</span>
                    <span className="row-value">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span className="row-label">Total Pembayaran</span>
                    <span className="row-value">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Tombol Sejajar */}
                <div className="checkout-buttons-row">
                  <Link to="/products" className="btn btn-outline">
                    ← Kembali Belanja
                  </Link>
                  <button 
                    onClick={handleCheckout}
                    className="btn btn-primary"
                    aria-label="Lanjut ke checkout"
                  >
                    🛒 Lanjut ke Checkout
                  </button>
                </div>
              </div>

              {/* Cart Items - DI TENGAH */}
              <div className="cart-items-centered">
                <div className="cart-header">
                  <h2 className="cart-items-title">Produk di Keranjang ({cartItems.length})</h2>
                  <button 
                    onClick={() => {
                      if (window.confirm('Yakin ingin menghapus semua item dari keranjang?')) {
                        cartItems.forEach(item => removeFromCart(item.id));
                      }
                    }}
                    className="btn-clear-all"
                    aria-label="Hapus semua item"
                  >
                    🗑️ Hapus Semua
                  </button>
                </div>
                
                <div className="cart-items">
                  {cartItems.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                  ))}
                </div>

                {/* Additional Info */}
                <div className="additional-info">
                  <div className="info-item">
                    <span className="info-icon">🚚</span>
                    <div className="info-text">
                      <strong>Estimasi Pengiriman:</strong>
                      <p>2-4 hari kerja untuk wilayah Jabodetabek</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">💳</span>
                    <div className="info-text">
                      <strong>Metode Pembayaran:</strong>
                      <p>Transfer Bank, E-Wallet, QRIS, Kartu Kredit</p>
                    </div>
                  </div>
                  <div className="secure-checkout">
                    <span className="secure-icon">🔒</span>
                    <span className="secure-text">Checkout Aman & Terenkripsi</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;