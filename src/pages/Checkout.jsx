import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    shippingMethod: 'regular',
    paymentMethod: 'bank_transfer',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    notes: '',
    termsAccepted: false,
    newsletter: false
  });
  
  const [errors, setErrors] = useState({});

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
    if (subtotal >= 500000 || subtotal === 0) return 0;
    return formData.shippingMethod === 'express' ? 25000 : 15000;
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch(step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
        if (!formData.email.trim()) {
          newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email tidak valid';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Nomor telepon wajib diisi';
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
          newErrors.phone = 'Nomor telepon tidak valid';
        }
        break;
        
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi';
        if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
        if (!formData.province.trim()) newErrors.province = 'Provinsi wajib diisi';
        if (!formData.postalCode.trim()) {
          newErrors.postalCode = 'Kode pos wajib diisi';
        } else if (!/^[0-9]{5}$/.test(formData.postalCode)) {
          newErrors.postalCode = 'Kode pos tidak valid (5 digit)';
        }
        break;
        
      case 3:
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Pilih metode pembayaran';
        
        if (formData.paymentMethod === 'credit_card') {
          if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Nomor kartu wajib diisi';
          if (!formData.cardName.trim()) newErrors.cardName = 'Nama di kartu wajib diisi';
          if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Tanggal kadaluarsa wajib diisi';
          if (!formData.cardCVC.trim()) newErrors.cardCVC = 'CVC wajib diisi';
        }
        
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = 'Anda harus menyetujui syarat dan ketentuan';
        }
        break;
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validateStep();
    
    if (Object.keys(validationErrors).length === 0) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handlePlaceOrder();
      }
    } else {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = () => {
    const order = {
      id: `TS-${Date.now()}`,
      date: new Date().toISOString(),
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        }
      },
      items: cartItems,
      shipping: {
        method: formData.shippingMethod === 'express' ? 'Express (1-2 hari)' : 'Regular (3-5 hari)',
        cost: shipping
      },
      payment: {
        method: formData.paymentMethod === 'bank_transfer' ? 'Transfer Bank' : 
                formData.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'Kartu Kredit'
      },
      totals: {
        subtotal,
        shipping,
        tax,
        total
      },
      status: 'pending'
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    clearCart();
    
    alert(`🎉 Order berhasil! No. Order: ${order.id}\nSilakan cek email ${order.customer.email} untuk detail pembayaran.`);
    
    navigate('/');
  };

  const getPaymentMethodLabel = (method) => {
    switch(method) {
      case 'bank_transfer': return 'Transfer Bank';
      case 'e_wallet': return 'E-Wallet';
      case 'credit_card': return 'Kartu Kredit/Debit';
      default: return '';
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Selesaikan pembelian Anda dalam 3 langkah mudah</p>
        </div>

        <div className="checkout-container">
          <div className="checkout-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Informasi Kontak</div>
            </div>
            <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Alamat Pengiriman</div>
            </div>
            <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Pembayaran</div>
            </div>
          </div>

          <div className="checkout-content">
            <div className="checkout-form-section">
              {step === 1 && (
                <div className="checkout-step">
                  <h2 className="step-title">Informasi Kontak</h2>
                  <p className="step-description">
                    Masukkan informasi kontak Anda untuk notifikasi order
                  </p>
                  
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-input ${errors.fullName ? 'error' : ''}`}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                    {errors.fullName && (
                      <span className="error-message">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="nama@email.com"
                        required
                      />
                      {errors.email && (
                        <span className="error-message">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        No. Telepon *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="081234567890"
                        required
                      />
                      {errors.phone && (
                        <span className="error-message">{errors.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="checkout-step">
                  <h2 className="step-title">Alamat Pengiriman</h2>
                  <p className="step-description">
                    Masukkan alamat lengkap untuk pengiriman produk
                  </p>
                  
                  <div className="form-group">
                    <label htmlFor="address" className="form-label">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
                      rows="3"
                      required
                    />
                    {errors.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">
                        Kota *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`form-input ${errors.city ? 'error' : ''}`}
                        placeholder="Jakarta Selatan"
                        required
                      />
                      {errors.city && (
                        <span className="error-message">{errors.city}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="province" className="form-label">
                        Provinsi *
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={`form-input ${errors.province ? 'error' : ''}`}
                        placeholder="DKI Jakarta"
                        required
                      />
                      {errors.province && (
                        <span className="error-message">{errors.province}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="postalCode" className="form-label">
                        Kode Pos *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`form-input ${errors.postalCode ? 'error' : ''}`}
                        placeholder="12345"
                        maxLength="5"
                        required
                      />
                      {errors.postalCode && (
                        <span className="error-message">{errors.postalCode}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="shippingMethod" className="form-label">
                        Metode Pengiriman
                      </label>
                      <div className="shipping-options">
                        <label className={`shipping-option ${formData.shippingMethod === 'regular' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="regular"
                            checked={formData.shippingMethod === 'regular'}
                            onChange={handleChange}
                            className="option-input"
                          />
                          <div className="option-content">
                            <span className="option-title">Regular (3-5 hari)</span>
                            <span className="option-price">
                              {subtotal >= 500000 ? 'Gratis' : 'Rp 15.000'}
                            </span>
                          </div>
                        </label>
                        
                        <label className={`shipping-option ${formData.shippingMethod === 'express' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === 'express'}
                            onChange={handleChange}
                            className="option-input"
                          />
                          <div className="option-content">
                            <span className="option-title">Express (1-2 hari)</span>
                            <span className="option-price">Rp 25.000</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="checkout-step">
                  <h2 className="step-title">Metode Pembayaran</h2>
                  <p className="step-description">
                    Pilih metode pembayaran yang paling nyaman untuk Anda
                  </p>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Pilih Metode Pembayaran *
                    </label>
                    <div className="payment-options">
                      <label className={`payment-option ${formData.paymentMethod === 'bank_transfer' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === 'bank_transfer'}
                          onChange={handleChange}
                          className="option-input"
                        />
                        <div className="option-content">
                          <span className="option-icon">🏦</span>
                          <div className="option-details">
                            <span className="option-title">Transfer Bank</span>
                            <span className="option-description">BCA, BNI, Mandiri, BRI</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`payment-option ${formData.paymentMethod === 'e_wallet' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="e_wallet"
                          checked={formData.paymentMethod === 'e_wallet'}
                          onChange={handleChange}
                          className="option-input"
                        />
                        <div className="option-content">
                          <span className="option-icon">📱</span>
                          <div className="option-details">
                            <span className="option-title">E-Wallet</span>
                            <span className="option-description">Dana, OVO, Gopay, LinkAja</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`payment-option ${formData.paymentMethod === 'credit_card' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleChange}
                          className="option-input"
                        />
                        <div className="option-content">
                          <span className="option-icon">💳</span>
                          <div className="option-details">
                            <span className="option-title">Kartu Kredit/Debit</span>
                            <span className="option-description">Visa, Mastercard, JCB</span>
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <span className="error-message">{errors.paymentMethod}</span>
                    )}
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="credit-card-form">
                      <div className="form-group">
                        <label htmlFor="cardNumber" className="form-label">
                          Nomor Kartu *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && (
                          <span className="error-message">{errors.cardNumber}</span>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="cardName" className="form-label">
                            Nama di Kartu *
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={`form-input ${errors.cardName ? 'error' : ''}`}
                            placeholder="Nama lengkap sesuai kartu"
                          />
                          {errors.cardName && (
                            <span className="error-message">{errors.cardName}</span>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="cardExpiry" className="form-label">
                            Tanggal Kadaluarsa *
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            className={`form-input ${errors.cardExpiry ? 'error' : ''}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.cardExpiry && (
                            <span className="error-message">{errors.cardExpiry}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="cardCVC" className="form-label">
                            CVC *
                          </label>
                          <input
                            type="text"
                            id="cardCVC"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleChange}
                            className={`form-input ${errors.cardCVC ? 'error' : ''}`}
                            placeholder="123"
                            maxLength="3"
                          />
                          {errors.cardCVC && (
                            <span className="error-message">{errors.cardCVC}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="notes" className="form-label">
                      Catatan Pesanan (Opsional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Contoh: Tandai paket sebagai hadiah, hubungi sebelum datang, dll."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className={`checkbox-label ${errors.termsAccepted ? 'error' : ''}`}>
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="checkbox-input"
                        required
                      />
                      <span className="checkbox-text">
                        Saya setuju dengan <Link to="/terms" className="terms-link">Syarat & Ketentuan</Link> dan <Link to="/privacy" className="terms-link">Kebijakan Privasi</Link> *
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <span className="error-message">{errors.termsAccepted}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons - TOMBOL SEJAJAR */}


{/* Navigation Buttons - TOMBOL SEJAJAR */}
              <div className="step-navigation">
                <div className="navigation-buttons-row">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-outline btn-prev"
                      aria-label="Kembali ke langkah sebelumnya"
                    >
                      ← Kembali
                    </button>
                  ) : (
                    <Link to="/cart" className="btn btn-outline btn-back-to-cart">
                      ← Kembali ke Keranjang
                    </Link>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`btn btn-primary btn-next ${cartItems.length === 0 ? 'disabled' : ''}`}
                    disabled={cartItems.length === 0}
                    aria-label={step < 3 ? 'Lanjut ke langkah berikutnya' : 'Buat pesanan'}
                  >
                    {step < 3 ? 'Lanjut →' : 'Buat Pesanan'}
                  </button>
                </div>
              </div>
            </div>

            <div className="order-summary-section">
              <div className="order-summary-card">
                <h2 className="summary-title">Ringkasan Pesanan</h2>
                
                <div className="order-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-meta">
                          <span className="item-quantity">{item.quantity} × </span>
                          <span className="item-price">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="total-row">
                    <span>Biaya Pengiriman</span>
                    <span className={shipping === 0 ? 'free' : ''}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="total-row">
                    <span>PPN (11%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total Pembayaran</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="order-info">
                  <div className="info-item">
                    <span className="info-icon">📦</span>
                    <div className="info-text">
                      <strong>Pengiriman:</strong>
                      <p>{formData.shippingMethod === 'express' ? '1-2 hari kerja' : '3-5 hari kerja'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">💳</span>
                    <div className="info-text">
                      <strong>Pembayaran:</strong>
                      <p>{getPaymentMethodLabel(formData.paymentMethod)}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📧</span>
                    <div className="info-text">
                      <strong>Konfirmasi:</strong>
                      <p>Invoice akan dikirim ke {formData.email || 'email Anda'}</p>
                    </div>
                  </div>
                </div>

                <div className="security-badge">
                  <span className="badge-icon">🔒</span>
                  <div className="badge-text">
                    <strong>Transaksi 100% Aman</strong>
                    <p>Data Anda dilindungi dengan enkripsi SSL 256-bit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;