import React from 'react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    if (window.confirm(`Hapus ${item.name} dari keranjang?`)) {
      removeFromCart(item.id);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      <div className="cart-item-details">
        <div className="cart-item-header">
          <h3 className="cart-item-name">{item.name}</h3>
          <button 
            className="cart-item-remove"
            onClick={handleRemove}
            aria-label={`Hapus ${item.name}`}
          >
            ✕
          </button>
        </div>
        
        <p className="cart-item-category">{item.category}</p>
        <p className="cart-item-price-single">{formatPrice(item.price)}</p>
        
        <div className="cart-item-controls">
          <div className="quantity-selector">
            <button 
              className="quantity-btn decrease"
              onClick={handleDecrease}
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <input 
              type="number" 
              className="quantity-input"
              value={item.quantity}
              min="1"
              max="99"
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                updateQuantity(item.id, Math.min(Math.max(value, 1), 99));
              }}
              aria-label="Jumlah produk"
            />
            <button 
              className="quantity-btn increase"
              onClick={handleIncrease}
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
          
          <div className="cart-item-total">
            <span className="total-label">Subtotal:</span>
            <span className="total-price">{formatPrice(itemTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;