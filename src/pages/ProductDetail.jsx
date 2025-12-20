import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = productsData.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products (same category, excluding current product)
      const related = productsData
        .filter(p => p.category === foundProduct.category && p.id !== productId)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      navigate('/products', { replace: true });
    }
  }, [id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    alert(`✅ ${quantity} ${product.name} telah ditambahkan ke keranjang!`);
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    
    addToCart(product);
    navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, Math.min(product.stock, newQuantity));
    setQuantity(qty);
  };

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat produk...</p>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to="/">Beranda</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products">Produk</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/products?category=${product.category}`}>
                {product.category}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="product-detail-container">
          {/* Product Images - HANYA SATU GAMBAR */}
          <div className="product-images-single">
            <div className="main-image">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-main-image"
              />
              {product.stock < 10 && product.stock > 0 && (
                <div className="stock-warning">
                  ⚠️ Hanya tersisa {product.stock} unit!
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                <span className="product-category">{product.category}</span>
                <span className="product-sku">SKU: TS{product.id.toString().padStart(3, '0')}</span>
              </div>
            </div>

            <div className="product-rating-section">
              <div className="rating-stars">
                {'⭐'.repeat(5)}
                <span className="rating-value">4.8/5</span>
              </div>
              <span className="review-count">(128 ulasan)</span>
            </div>

            <div className="product-price-section">
              <div className="current-price">
                {formatPrice(product.price)}
              </div>
              <div className="price-info">
                <span className="tax-info">Termasuk PPN 11%</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Deskripsi Produk</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-specifications">
              <h3>Spesifikasi Teknis</h3>
              <div className="specs-grid">
                {product.specs && product.specs.map((spec, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-dot">•</span>
                    <span className="spec-text">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-stock-info">
              <div className="stock-status">
                <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? '✅ Tersedia' : '❌ Stok Habis'}
                </span>
                <span className="stock-count">
                  {product.stock > 0 ? `${product.stock} unit tersedia` : 'Stok akan segera diisi ulang'}
                </span>
              </div>
            </div>

            {/* Quantity and Actions - DI GARIS BIRU */}
            <div className="product-actions-blue-line">
              <div className="quantity-selector">
                <label htmlFor="quantity">Jumlah:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Kurangi jumlah"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="quantity-input"
                    aria-label="Jumlah produk"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons-blue-line">
                <button
                  className={`btn btn-primary btn-add-to-cart ${product.stock === 0 ? 'disabled' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  aria-label="Tambahkan ke keranjang"
                >
                  <span className="btn-icon">🛒</span>
                  Tambah ke Keranjang
                </button>
                
                <button
                  className={`btn btn-secondary btn-buy-now ${product.stock === 0 ? 'disabled' : ''}`}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  aria-label="Beli sekarang"
                >
                  <span className="btn-icon">⚡</span>
                  Beli Sekarang
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <div className="feature-text">
                  <strong>Gratis Ongkir</strong>
                  <p>Minimal pembelian Rp 500.000</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🔄</span>
                <div className="feature-text">
                  <strong>Garansi 1 Tahun</strong>
                  <p>Garansi resmi produsen</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <div className="feature-text">
                  <strong>100% Original</strong>
                  <p>Barang baru dan garansi resmi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <div className="section-header">
              <h2 className="section-title">Produk Terkait</h2>
              <p className="section-subtitle">Anda mungkin juga menyukai:</p>
            </div>
            <div className="products-grid">
              {relatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="back-section">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline btn-back"
          >
            ← Kembali ke Produk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;