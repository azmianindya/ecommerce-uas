import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">NindyaMart</h3>
            <p className="footer-description">
              Toko elektronik terpercaya dengan produk berkualitas dan harga terbaik. 
              Pengalaman belanja online yang aman dan nyaman.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="YouTube">📺</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Navigasi</h4>
            <ul className="footer-links">
              <li><a href="/">Beranda</a></li>
              <li><a href="/products">Semua Produk</a></li>
              <li><a href="/cart">Keranjang Belanja</a></li>
              <li><a href="/#categories">Kategori Produk</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Kontak Kami</h4>
            <div className="contact-info">
              <p className="contact-item">📧 info@NindyaMart.com</p>
              <p className="contact-item">📞 (021) 1234-5678</p>
              <p className="contact-item">📱 0812-3456-7890</p>
              <p className="contact-item">🕐 Buka: 08:00 - 22:00 WIB</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Alamat</h4>
            <address className="address">
              <p>Gedung NindyaMart Lt. 5</p>
              <p>Jl. Teknologi No. 123, Kel. Digital</p>
              <p>Kec. Modern, Kota Jakarta Selatan</p>
              <p>Indonesia 12345</p>
            </address>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="payment-methods">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">🏦</span>
            <span className="payment-icon">📱</span>
            <span className="payment-icon">💎</span>
            <span className="payment-icon">🔒</span>
          </div>
          
          <div className="copyright">
            <p>&copy; {currentYear} <strong>NindyaMart</strong> - Proyek UAS Front-End Development</p>
            <p className="disclaimer">
              Website ini dibuat untuk keperluan akademik. Semua produk dan harga adalah fiktif.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;