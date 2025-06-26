import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/v1/products/get/${id}`);
      setProduct(res.data);
      setSelectedImage(res.data.imageUrl);
      const categoryName = typeof res.data.category === 'object' ? res.data.category.name : res.data.category;
      if (categoryName) fetchSimilarProducts(categoryName);
    } catch (err) {
      setError('Product not found');
    }
  };

  const fetchSimilarProducts = async (categoryName) => {
    try {
      const res = await api.get(`/v1/products/category/byname?name=${encodeURIComponent(categoryName)}`);
      const filtered = res.data.filter(p => p.id !== Number(id));
      setSimilarProducts(filtered);
    } catch (err) {
      console.error('Similar fetch failed:', err);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await api.post('/v1/carts/items', {
        productId: product.id,
        quantity: 1
      });
      toast.success('Added to cart', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error('Failed to add to cart', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        product: { id: product.id, price: product.price, name: product.name, imageUrl: product.imageUrl }
      } 
    });
  };

  const handleSimilarProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>😞</div>
        <h2 style={{ color: '#e74c3c', marginBottom: '10px' }}>Product Not Found</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px',
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
          Loading...
        </div>
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
          
          .product-button {
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .product-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
          
          .product-image {
            transition: transform 0px;
          }
          
          .product-image:hover {
            transform: scale(1.02);
          }
          
          .offer-card {
            transition: transform 0.2s ease;
          }
          
          .offer-card:hover {
            transform: translateX(5px);
          }
          
          .similar-products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
          }
          
          @media (max-width: 1200px) {
            .similar-products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 768px) {
            .similar-products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .product-container {
              display-flex !important;
              flex-direction: column !important;
            }
            .product-image-container {
              align-items: center !important;
            }
          }
          @media (max-width: 480px) {
            .similar-products-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div
          className="product-container"
          style={{
            display: 'flex',
            gap: '50px',
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '40px'
          }}
        >
          <div
            className="product-image-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minWidth: '500px'
            }}
          >
            <div style={{
              position: 'relative',
              marginBottom: '30px'
            }}>
              <img
                src={selectedImage || '/placeholder.png'}
                alt={product.name}
                className="product-image"
                style={{
                  width: '500px',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  border: '3px solid #f1f2f6',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(231,76,60,0.3)'
              }}>
                33% OFF
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              width: '100%'
            }}>
              <button
                onClick={handleAddToCart}
                className="product-button"
                style={{
                  background: 'linear-gradient(135deg, #ff3f6c, #e91e63)',
                  color: '#fff',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flex: 1,
                  boxShadow: '0 4px 15px rgba(255,63,108,0.3)'
                }}
              >
                <span></span>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="product-button"
                style={{
                  background: 'linear-gradient(135deg, #fb641b, #ff5722)',
                  color: '#fff',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flex: 1,
                  boxShadow: '0 4px 15px rgba(251,100,27,0.3)'
                }}
              >
                <span></span>
                Buy Now
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              borderBottom: '2px solid #f1f2f6',
              paddingBottom: '20px',
              marginBottom: '25px'
            }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2c3e50',
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              }}>
                {product.name}
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#7f8c8d',
                lineHeight: '1.6',
                margin: '0'
              }}>
                {product.description || 'No description available'}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#27ae60'
                }}>
                  ₹{product.price}
                </span>
                <span style={{
                  fontSize: '20px',
                  color: '#95a5a6',
                  textDecoration: 'line-through'
                }}>
                  ₹{(product.price * 1.5).toFixed(0)}
                </span>
                <span style={{
                  background: '#27ae60',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  33% off
                </span>
              </div>
              <p style={{
                color: '#27ae60',
                fontSize: '14px',
                margin: '0',
                fontWeight: '500'
              }}>
                💰 You save ₹{((product.price * 1.5) - product.price).toFixed(0)}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #b8dabc'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#155724',
                margin: '0 0 10px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>💰</span>
                Coupons for you
              </h3>
              <p style={{
                color: '#155724',
                margin: '0',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✅ Get extra ₹15 off on 20 items (price inclusive of cashback)
              </p>
            </div>

            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50',
                margin: '0 0 15px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🏦</span>
                Available offers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '💳 Bank Offer 100% Cashback upto 500Rs on Axis Bank SuperMoney Rupay CC UPI transactions',
                  '💳 Bank Offer 5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter',
                  '💳 Bank Offer 10% instant discount on SBI Credit Card EMI Transactions, up to 1,500 on orders of ₹5,000 and above'
                ].map((offer, index) => (
                  <div
                    key={index}
                    className="offer-card"
                    style={{
                      padding: '12px 15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      fontSize: '14px',
                      color: '#495057'
                    }}
                  >
                    {offer}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2c3e50',
            margin: '0 0 30px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>🔍</span>
            Similar Products
          </h2>
          
          <div className="similar-products-grid">
            {similarProducts.length > 0 ? (
            similarProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => handleSimilarProductClick(p.id)}
              />
            ))
            ) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#7f8c8d'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ color: '#95a5a6', marginBottom: '10px' }}>No similar products found</h3>
                <p>We couldn't find any similar products at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default ProductDetail;