import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const Home = ({ addToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Ambil 4 produk sebagai featured
    setFeaturedProducts(productsData.slice(0, 4));
    
    // Ambil kategori unik
    const uniqueCategories = [...new Set(productsData.map(p => p.category))];
    setCategories(uniqueCategories);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Teknologi Terkini untuk 
                <span className="highlight"> Gaya Hidup Modern</span>
              </h1>
              <p className="hero-subtitle">
                Temukan smartphone, laptop, dan gadget terbaru dengan kualitas terbaik 
                dan harga kompetitif hanya di NindyaMart.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Produk</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Pelanggan</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-primary btn-large">
                  🛍️ Mulai Belanja
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600" 
                alt="Gadget Collection" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories" id="categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kategori Produk</h2>
            <p className="section-subtitle">Temukan produk favorit Anda berdasarkan kategori</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/products?category=${category}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category === 'Smartphone' && '📱'}
                  {category === 'Laptop' && '💻'}
                  {category === 'TV' && '📺'}
                  {category === 'Audio' && '🎧'}
                  {category === 'Wearable' && '⌚'}
                  {category === 'Tablet' && '📱'}
                  {category === 'Camera' && '📷'}
                  {category === 'Monitor' && '🖥️'}
                  {category === 'Accessories' && '⌨️'}
                </div>
                <h3 className="category-name">{category}</h3>
                <p className="category-count">
                  {productsData.filter(p => p.category === category).length} produk
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Produk Unggulan</h2>
            <p className="section-subtitle">Produk terbaik pilihan NindyaMart</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/products" className="btn btn-secondary">
              🔍 Lihat Semua Produk ({productsData.length})
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Gratis Ongkir</h3>
              <p className="feature-description">
                Gratis pengiriman untuk semua pesanan di atas Rp 500.000
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Garansi 30 Hari</h3>
              <p className="feature-description">
                Garansi pengembalian 30 hari untuk semua produk
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Pembayaran Aman</h3>
              <p className="feature-description">
                Sistem pembayaran terenkripsi untuk keamanan transaksi
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3 className="feature-title">Dukungan 24/7</h3>
              <p className="feature-description">
                Tim customer service siap membantu kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;