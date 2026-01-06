import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Data statistik dashboard
  const stats = [
    { label: 'Total Produk', value: '1.234', change: '+12%', icon: '📦', type: 'products' },
    { label: 'Pesanan Hari Ini', value: '89', change: '+8%', icon: '📋', type: 'orders' },
    { label: 'Pengguna Aktif', value: '5.678', change: '+5%', icon: '👥', type: 'users' },
    { label: 'Pendapatan', value: 'Rp 12.450.000', change: '+15%', icon: '💰', type: 'revenue' }
  ];

  // Grafik penjualan (data dummy)
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'Mei', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  // Produk terlaris
  const topProducts = [
    { id: 1, name: 'Laptop Gaming', sold: 234, revenue: 'Rp 12.345.000' },
    { id: 2, name: 'Smartphone Pro', sold: 189, revenue: 'Rp 9.876.000' },
    { id: 3, name: 'Headphone Wireless', sold: 156, revenue: 'Rp 4.567.000' },
    { id: 4, name: 'Smart Watch', sold: 123, revenue: 'Rp 6.789.000' },
    { id: 5, name: 'Tablet Mini', sold: 98, revenue: 'Rp 3.456.000' },
  ];

  // Quick actions
  const quickActions = [
    { icon: '➕', text: 'Tambah Produk' },
    { icon: '📊', text: 'Lihat Analitik' },
    { icon: '📦', text: 'Kelola Inventori' },
    { icon: '📋', text: 'Proses Pesanan' }
  ];

  // Cek halaman aktif
  const isHome = location.pathname === '/admin-dashboard';
  const isProducts = location.pathname === '/admin-dashboard/products';
  const isCart = location.pathname === '/admin-dashboard/cart';

  // Jika bukan route admin yang valid, redirect ke beranda admin
  if (!isHome && !isProducts && !isCart) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  const handleActionClick = (action) => {
    alert(`Aksi: ${action.text} - Fitur ini akan segera tersedia!`);
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <Link to="/admin-dashboard" className="admin-logo">
            <span className="admin-logo-icon">🛒</span>
            <span className="admin-logo-text">NindyaMart</span>
          </Link>
          
          <nav className="admin-nav">
            <Link 
              to="/admin-dashboard" 
              className={`admin-nav-link ${isHome ? 'active' : ''}`}
            >
              🏠 Beranda
            </Link>
            <Link 
              to="/admin-dashboard/products" 
              className={`admin-nav-link ${isProducts ? 'active' : ''}`}
            >
              📦 Produk
            </Link>
            <Link 
              to="/admin-dashboard/cart" 
              className={`admin-nav-link ${isCart ? 'active' : ''}`}
            >
              🛒 Keranjang
            </Link>
            <button 
              onClick={logout} 
              className="admin-nav-link logout"
            >
              👋 Logout ({user?.username})
            </button>
          </nav>
        </div>
      </header>

      {/* Admin Dashboard Content */}
      <div className="admin-dashboard-container">
        {isHome ? (
          // Halaman Beranda - Dashboard Statistik
          <>
            {/* Welcome Section */}
            <div className="admin-welcome">
              <h1>Selamat datang kembali, Admin!</h1>
              <p>Ini yang terjadi dengan toko Anda hari ini.</p>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className={`stat-icon ${stat.type}`}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {stat.change} ✓
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2 className="section-title">Aksi Cepat</h2>
              <div className="actions-grid">
                {quickActions.map((action, index) => (
                  <button 
                    key={index} 
                    className="action-button"
                    onClick={() => handleActionClick(action)}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span className="action-text">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grafik Penjualan */}
            <div className="sales-chart-section">
              <div className="section-header">
                <h2 className="section-title">Ringkasan Penjualan</h2>
                <select className="time-selector">
                  <option>6 Bulan Terakhir</option>
                  <option>Tahun Lalu</option>
                  <option>Seluruh Waktu</option>
                </select>
              </div>
              <div className="chart-container">
                <div className="chart">
                  {salesData.map((item, index) => (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${(item.sales / 6000) * 200}px` }}>
                        <span className="chart-value">Rp {item.sales.toLocaleString('id-ID')}.000</span>
                      </div>
                      <div className="chart-label">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Produk Terlaris */}
            <div className="top-products-section">
              <h2 className="section-title">Produk Terlaris</h2>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Terjual</th>
                      <th>Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="units-sold">{product.sold} unit</span>
                        </td>
                        <td>
                          <span className="revenue">{product.revenue}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pesanan Terbaru */}
            <div className="recent-orders-section">
              <h2 className="section-title">Pesanan Terbaru</h2>
              <div className="orders-list">
                <div className="order-item">
                  <div className="order-info">
                    <span className="order-id">#ORD-7890</span>
                    <span className="order-customer">John Doe</span>
                  </div>
                  <div className="order-status status-processing">Diproses</div>
                  <div className="order-total">Rp 456.780</div>
                </div>
                <div className="order-item">
                  <div className="order-info">
                    <span className="order-id">#ORD-7889</span>
                    <span className="order-customer">Jane Smith</span>
                  </div>
                  <div className="order-status status-shipped">Dikirim</div>
                  <div className="order-total">Rp 234.560</div>
                </div>
                <div className="order-item">
                  <div className="order-info">
                    <span className="order-id">#ORD-7888</span>
                    <span className="order-customer">Bob Johnson</span>
                  </div>
                  <div className="order-status status-delivered">Terkirim</div>
                  <div className="order-total">Rp 789.120</div>
                </div>
              </div>
            </div>
          </>
        ) : isProducts ? (
          // Halaman Produk - Coming Soon
          <div className="coming-soon-container">
            <div className="coming-soon-content">
              <div className="coming-soon-icon">📦</div>
              <h1 className="coming-soon-title">Manajemen Produk</h1>
              <p className="coming-soon-message">
                Dashboard manajemen produk kami akan segera hadir!
              </p>
              <p className="coming-soon-submessage">
                Anda akan dapat menambah, mengedit, dan mengelola semua produk Anda di sini.
              </p>
              <Link to="/admin-dashboard" className="btn btn-primary">
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        ) : (
          // Halaman Keranjang - Coming Soon
          <div className="coming-soon-container">
            <div className="coming-soon-content">
              <div className="coming-soon-icon">🛒</div>
              <h1 className="coming-soon-title">Manajemen Pesanan</h1>
              <p className="coming-soon-message">
                Sistem manajemen pesanan kami akan segera hadir!
              </p>
              <p className="coming-soon-submessage">
                Anda akan dapat melihat dan memproses semua pesanan pelanggan di sini.
              </p>
              <Link to="/admin-dashboard" className="btn btn-primary">
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;