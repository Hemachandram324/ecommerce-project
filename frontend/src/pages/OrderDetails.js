import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/order/${orderId}`);
        const baseOrder = res.data;

        const itemsWithImages = await Promise.all(
          baseOrder.items.map(async (item) => {
            try {
              const productRes = await api.get(`/v1/products/get/${item.productId}`);
              return {
                ...item,
                productImageUrl: productRes.data.imageUrl,
                productName: productRes.data.name || item.productName,
              };
            } catch (error) {
              console.warn(`Product ${item.productId} not found or deleted.`);
              return {
                ...item,
                productImageUrl: null,
                productName: item.productName || 'Product no longer available',
              };
            }
          })
        );

        setOrder({ ...baseOrder, items: itemsWithImages });
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load order.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const cancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.delete(`/orders/${orderId}`);
        toast.success('Order cancelled successfully.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/');
      } catch (err) {
        console.error(err);
        toast.error('Failed to cancel order.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#ffa500',
      processing: '#2196f3',
      shipped: '#4caf50',
      delivered: '#8bc34a',
      cancelled: '#f44336'
    };
    return statusColors[status?.toLowerCase()] || '#757575';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div style={{
          display: 'flex',
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
          Loading order...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>No order found</h2>
        <p style={{ color: '#999' }}>The order you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .order-button {
            transition: all 0.3s ease;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .order-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .item-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{
                margin: '0 0 10px 0',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                Order #{order.id}
              </h1>
              <p style={{
                margin: '0',
                opacity: '0.9',
                fontSize: '16px'
              }}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 20px',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 20px',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                ₹{order.total}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '30px'
        }}>
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#333'
              }}>
                Order Items ({order.items.length})
              </h3>

              {order.items.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#666'
                }}>
                  <p>No items found in this order.</p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="item-card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e9ecef',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{
                        position: 'relative',
                        marginRight: '20px'
                      }}>
                        <img
                          src={item.productImageUrl || '/placeholder.png'}
                          alt={item.productName || 'Product'}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #f8f9fa'
                          }}
                          onError={(e) => (e.target.src = '/placeholder.png')}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#667eea',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {item.quantity}
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 8px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          {item.productName || 'Unknown Product'}
                        </h4>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}>
                          <span style={{
                            color: '#666',
                            fontSize: '14px'
                          }}>
                            ₹{item.unitPrice} × {item.quantity}
                          </span>
                          <span style={{
                            fontWeight: '600',
                            fontSize: '16px',
                            color: '#667eea'
                          }}>
                            ₹{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
              }}>
                Shipping Address
              </h3>

              <div style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea'
              }}>
                <div style={{
                  lineHeight: '1.6',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {order.shippingAddress.fullName}
                  </div>
                  <div>{order.shippingAddress.street || order.shippingAddress.addressLine1}</div>
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </div>
                  <div>{order.shippingAddress.country}</div>
                  <div style={{
                    marginTop: '8px'
                  }}>
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button
                  onClick={() => navigate('/myorders')}
                  className="order-button"
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '14px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  View All Orders
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="order-button"
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '14px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Continue Shopping
                </button>

                <button
                  onClick={cancelOrder}
                  className="order-button"
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '14px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '60px' }}>
        <Footer />
      </div>
    </div>
  );
}

export default OrderDetails;