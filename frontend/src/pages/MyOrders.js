import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/user');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        alert('Error loading your orders');
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderColor: '#fde68a'
        };
      case 'processing':
        return {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderColor: '#93c5fd'
        };
      case 'shipped':
        return {
          backgroundColor: '#e9d5ff',
          color: '#7c2d12',
          borderColor: '#c4b5fd'
        };
      case 'delivered':
        return {
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderColor: '#86efac'
        };
      case 'cancelled':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderColor: '#fca5a5'
        };
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db'
        };
    }
  };

  const getProgressStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          backgroundColor: '#eab308',
          width: '25%'
        };
      case 'processing':
        return {
          backgroundColor: '#3b82f6',
          width: '50%'
        };
      case 'shipped':
        return {
          backgroundColor: '#8b5cf6',
          width: '75%'
        };
      case 'delivered':
        return {
          backgroundColor: '#10b981',
          width: '100%'
        };
      default:
        return {
          backgroundColor: '#6b7280',
          width: '25%'
        };
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      padding: '0'
    }}>
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>My Orders</h1>
          <p style={{
            color: '#6b7280',
            margin: '0'
          }}>Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>No Orders Yet</h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '24px'
            }}>You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div style={{ padding: '24px' }}>
                  {/* Order Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 4px 0'
                      }}>
                        Order #{order.id}
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid',
                      ...getStatusStyles(order.status)
                    }}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#111827'
                    }}>₹{order.total}</span>
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontWeight: '500',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ padding: '0 24px 16px' }}>
                  <div style={{
                    width: '100%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    height: '4px'
                  }}>
                    <div
                      style={{
                        height: '4px',
                        borderRadius: '9999px',
                        transition: 'all 0.3s',
                        ...getProgressStyles(order.status)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '64px' }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
