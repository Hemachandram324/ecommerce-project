import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (product) {
          const res = await api.get(`/v1/products/get/${product.id}`);
          const normalizeProduct = (data) => ({
            id: data.id,
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl || data.image || 'https://via.placeholder.com/80',
          });
          const productData = normalizeProduct(res.data);

          setCart({
            items: [{
              productId: productData.id,
              productName: productData.name,
              quantity: 1,
              price: productData.price,
              imageUrl: productData.imageUrl,
            }],
            total: productData.price,
          });
        } else {
          const res = await api.get('/v1/carts');
          const updatedItems = await Promise.all(
            res.data.items.map(async (item) => {
              const productRes = await api.get(`/v1/products/get/${item.productId}`);
              return {
                ...item,
                productName: productRes.data.name,
                imageUrl: productRes.data.imageUrl || productRes.data.image || 'https://via.placeholder.com/80',
              };
            })
          );
          setCart({ ...res.data, items: updatedItems });
        }
      } catch (err) {
        toast.error('Error loading data.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!stripe || !elements || !cardElement) {
        toast.error('Stripe not ready.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      const amount = Math.round(cart.total * 100);
      const cartItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const paymentIntentRes = await api.post('/payment/create-payment-intent', {
        amount,
        currency: 'usd',
        paymentMethodId: 'pm_card_visa',
      });

      const { clientSecret, paymentIntentId } = paymentIntentRes.data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(`Payment failed: ${error.message}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      const shippingAddress = {
        fullName: address.fullName,
        street: address.line1,
        city: address.city,
        state: address.state,
        zipCode: address.postalCode,
        country: address.country,
        phone: address.phone,
      };

      const checkoutRes = await api.post('/payment/checkout', {
        paymentIntentId: paymentIntent.id,
        shippingAddress,
        items: cartItems,
      });

      toast.success(`Order placed successfully! Order ID: ${checkoutRes.data.orderId}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate(`/order/${checkoutRes.data.orderId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Checkout failed.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading checkout...</span>
        </div>
      </div>
    );
  }

  const itemsToDisplay = cart?.items || [];

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page-container {
          min-height: 100vh;
          background: linear-gradient(white);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          flex: 1;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          color: #64748b;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 2rem;
          text-align: center;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border: 3px solid #e2e8f0;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 1.5rem 0;
        }

        .order-summary {
          position: sticky;
          top: 2rem;
        }

        .item-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .item-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .item-image {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 0.5rem;
          border: 2px solid #fff;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 0.25rem 0;
        }

        .item-quantity {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 0.25rem 0;
        }

        .item-price {
          font-size: 1rem;
          font-weight: 700;
          color: #059669;
          margin: 0;
        }

        .total-section {
          border-top: 2px solid #e2e8f0;
          padding-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #059669;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-input {
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fff;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .card-element-container {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #fff;
          transition: all 0.3s ease;
        }

        .card-element-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .submit-button {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .no-items {
          text-align: center;
          padding: 2rem;
          color: #64748b;
          font-size: 1rem;
        }

        .footer-spacing {
          margin-top: 4rem;
        }

        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          
          .order-summary {
            position: static;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="page-container">
        <div className="container">
          <h1 className="page-title">
            Checkout {product ? `- ${product.name}` : ''}
          </h1>

          <div className="checkout-grid">
            {/* Main Form */}
            <div>
              <form onSubmit={handleSubmit}>
                {/* Shipping Address Section */}
                <div className="card">
                  <div className="form-section">
                    <h3 className="section-title">Shipping Address</h3>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone *</label>
                        <input
                          type="tel"
                          required
                          className="form-input"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={address.line1}
                          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address Line 2</label>
                        <input
                          type="text"
                          className="form-input"
                          value={address.line2}
                          onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Postal Code *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={address.postalCode}
                          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                          placeholder="Enter postal code"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="form-section">
                    <h3 className="section-title">Payment Details</h3>
                    <div className="card-element-container">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#1a202c',
                              '::placeholder': {
                                color: '#64748b',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="submit-button"
                  >
                    {loading ? (
                      <>
                        <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}></span>
                        Processing...
                      </>
                    ) : (
                      `Complete Payment - $${cart?.total || 0}`
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="order-summary">
              <div className="card">
                <h3 className="card-title">Order Summary</h3>
                
                {itemsToDisplay.length > 0 ? (
                  <>
                    <div className="item-list">
                      {itemsToDisplay.map(item => (
                        <div key={item.productId} className="item-card">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/80'}
                            alt={item.productName}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80';
                            }}
                          />
                          <div className="item-details">
                            <h4 className="item-name">{item.productName}</h4>
                            <p className="item-quantity">Quantity: {item.quantity}</p>
                            <p className="item-price">${item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="total-section">
                      <span className="total-label">Total:</span>
                      <span className="total-amount">${cart?.total || 0}</span>
                    </div>
                  </>
                ) : (
                  <div className="no-items">
                    <p>No items to checkout.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-spacing">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}