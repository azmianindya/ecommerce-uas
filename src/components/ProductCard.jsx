import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          loading="lazy"
        />
        <div className="product-category-tag">
          {product.category}
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <div className="product-stock-tag">
            Hampir Habis!
          </div>
        )}
        {product.stock === 0 && (
          <div className="product-out-of-stock">
            Stok Habis
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {'⭐'.repeat(5)}
          <span className="rating-text">(4.5)</span>
        </div>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-description">{product.description.substring(0, 80)}...</p>
        
        <div className="product-stock-info">
          <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
          </span>
        </div>
        
        <div className="product-actions">
          <Link 
            to={`/product/${product.id}`} 
            className="btn btn-outline btn-detail"
            aria-label={`Detail ${product.name}`}
          >
            <span>🔍</span> Detail
          </Link>
          <button 
            className={`btn btn-primary btn-add-cart ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            aria-label={`Tambahkan ${product.name} ke keranjang`}
          >
            <span>🛒</span> {product.stock > 0 ? '+ Keranjang' : 'Stok Habis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;