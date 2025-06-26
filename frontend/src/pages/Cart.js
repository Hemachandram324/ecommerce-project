import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/v1/carts');
      const updatedItems = await Promise.all(
        res.data.items.map(async (item) => {
          try {
            const productRes = await api.get(`/v1/products/get/${item.productId}`);
            return { ...item, product: productRes.data };
          } catch (productErr) {
            console.error('Error fetching product for itemId', item.itemId, ':', productErr);
            return item;
          }
        })
      );
      setCart({ ...res.data, items: updatedItems });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        toast.error('Session expired. Please log in again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error(err);
        setError('Failed to load cart. Please try again later.');
        toast.error('Failed to load cart.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/v1/carts/items/${itemId}`);
      await fetchCart();
      toast.success('Item removed from cart.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to remove item. Please try again.');
      toast.error('Failed to remove item.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleClear = async () => {
    try {
      await api.delete('/v1/carts');
      setCart({ items: [], total: 0 });
      toast.success('Cart cleared successfully.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to clear cart. Please try again.');
      toast.error('Failed to clear cart.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/v1/carts/items/${itemId}`, { quantity });
      await fetchCart();
      toast.success('Quantity updated successfully.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to update quantity. Please try again.');
      toast.error('Failed to update quantity.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        Loading cart...
      </div>
    </div>
  );

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <p>{error}</p>
        <ToastContainer />
      </div>
    );
  }

  if (!cart || !cart.items) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      No cart data.
      <ToastContainer />
    </div>
  );

  const itemCount = cart.items.length;
  const totalPrice = cart.total || 0;
  const discount = 0;
  const coupons = 0;
  const finalAmount = totalPrice - discount - coupons;

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333', marginBottom: '20px', textAlign: 'center' }}>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Your cart is empty</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Left Side: Product List */}
          <div style={{ flex: 2, minWidth: '0' }}>
            {cart.items.map((item) => (
              <div
                key={item.itemId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  background: '#fff',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
                onClick={() => navigate(`/product/${item.product?.id}`)}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <img
                  src={item.product?.imageUrl || '/placeholder.png'}
                  alt={item.product?.name || 'Product'}
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                  onError={(e) => {
                    e.target.src = '/placeholder.png';
                  }}
                />
                <div style={{ marginLeft: '20px', flex: 1 }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                    {item.product?.name || 'Unknown Product'}
                  </h4>
                  <p style={{ fontSize: '16px', color: '#555', marginBottom: '5px' }}>
                    Price: ₹{item.price || item.product?.price || 'N/A'}
                  </p>
                  <p style={{ fontSize: '16px', color: '#555', fontWeight: '500', marginBottom: '10px' }}>
                    Subtotal: ₹
                    {item.price && item.quantity
                      ? (item.price * item.quantity).toFixed(2)
                      : item.product?.price && item.quantity
                      ? (item.product.price * item.quantity).toFixed(2)
                      : 'N/A'}
                  </p>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="button"
                      onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        backgroundColor: '#ff3f6c',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', color: '#333' }}>Qty: {item.quantity}</span>
                    <button
                      className="button"
                      onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                      style={{
                        backgroundColor: '#ff3f6c',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      +
                    </button>
                    <button
                      className="button"
                      onClick={() => handleRemove(item.itemId)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Price Details */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '15px' }}>PRICE DETAILS</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Price ({itemCount} items)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#28a745' }}>
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#28a745' }}>
                <span>Coupons for you</span>
                <span>- ₹{coupons}</span>
              </div>
              <hr style={{ border: '1px solid #eee', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '20px' }}>
                <span>Final Amount</span>
                <span>₹{finalAmount >= 0 ? finalAmount : 0}</span>
              </div>
              <button
                className="button"
                onClick={() => navigate('/checkout')}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%',
                }}
              >
                Proceed to Checkout
              </button>
              <button
                className="button"
                onClick={handleClear}
                style={{
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%',
                  marginTop: '10px',
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
      <br />
      <br />
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Cart;