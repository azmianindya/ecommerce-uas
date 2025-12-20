import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const Products = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(productsData);
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Get categories
  const categories = ['all', ...new Set(productsData.map(p => p.category))];

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setSelectedCategory(category);
      handleCategoryFilter(category);
    }
    
    if (search) {
      setSearchTerm(search);
      handleSearch(search);
    }
  }, [searchParams]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(product => {
        if (priceRange === '10000000-999999999') {
          return product.price >= min;
        }
        return product.price >= min && product.price <= max;
      });
    }

    // Sort products
    result = sortProducts(result, sortBy);

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category !== 'all') {
      setSearchParams({ category });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  const handlePriceFilter = (range) => {
    setPriceRange(range);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const sortProducts = (productsToSort, sortMethod) => {
    const sorted = [...productsToSort];
    
    switch (sortMethod) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('default');
    setSearchParams({});
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Katalog Produk</h1>
          <p className="page-subtitle">
            Temukan produk elektronik terbaik untuk kebutuhan Anda
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="filter-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              aria-label="Cari produk"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category-filter">Kategori:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="price-filter">Rentang Harga:</label>
              <select
                id="price-filter"
                value={priceRange}
                onChange={(e) => handlePriceFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Semua Harga</option>
                <option value="0-2000000">Rp 0 - 2 Juta</option>
                <option value="2000000-5000000">Rp 2 - 5 Juta</option>
                <option value="5000000-10000000">Rp 5 - 10 Juta</option>
                <option value="10000000-999999999">&gt; Rp 10 Juta</option>
                {/* Atau bisa pakai: */}
                {/* <option value="10000000-999999999">Diatas Rp 10 Juta</option> */}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-filter">Urutkan:</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="filter-select"
              >
                <option value="default">Default</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'default') && (
              <button 
                onClick={clearFilters} 
                className="btn btn-outline btn-clear"
                aria-label="Hapus semua filter"
              >
                ✕ Hapus Filter
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-content">
          {filteredProducts.length > 0 ? (
            <>
              <div className="products-info">
                <p className="products-count">
                  Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{productsData.length}</strong> produk
                </p>
              </div>
              
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">Produk tidak ditemukan</h3>
              <p className="no-results-message">
                Coba gunakan kata kunci lain atau hapus filter untuk melihat semua produk.
              </p>
              <button 
                onClick={clearFilters} 
                className="btn btn-primary"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          )}
        </div>

        {/* Quick Categories */}
        <div className="quick-categories">
          <h3 className="quick-categories-title">Kategori Populer:</h3>
          <div className="quick-categories-tags">
            {categories.slice(1).map(category => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;