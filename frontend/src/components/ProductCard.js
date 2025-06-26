import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await api.get('/v1/wishlist/list');
        const wishlistedIds = res.data.map((item) => item.id);
        setIsWishlisted(wishlistedIds.includes(product.id));
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      }
    };

    fetchWishlist();
  }, [product.id, token]);

  const toggleWishlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/v1/wishlist/remove/${product.id}`);
        setIsWishlisted(false);
        toast.info('Removed from wishlist', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await api.post(`/v1/wishlist/add/${product.id}`);
        setIsWishlisted(true);
        toast.success('Added to wishlist', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to update wishlist', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/v1/carts/items', {
        productId: product.id,
        quantity: 1,
      });
      toast.success('Product added to cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Error adding to cart:', err);
        toast.error('Something went wrong while adding to cart.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  if (!product || typeof product !== 'object') return null;

  const imageSrc = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : `http://localhost:8080/api/v1/products/image/${product.imageUrl}`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '0',
        width: '280px',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.12)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #f0f0f0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        marginBottom: '20px'
      }}
    >
      <div
        onClick={toggleWishlist}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 2,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.2s ease'
        }}
      >
        {isWishlisted ? (
          <FaHeart style={{ color: '#e74c3c', fontSize: '18px' }} />
        ) : (
          <FaRegHeart style={{ color: '#7f8c8d', fontSize: '18px' }} />
        )}
      </div>

      <Link
        to={`/product/${product.id}`}
        style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          borderRadius: '16px 16px 0 0',
          backgroundColor: '#f8f9fa'
        }}>
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          )}
          
          <img
            src={imageSrc}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = '/placeholder.png';
              setImageLoaded(true);
            }}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.4s ease',
              opacity: imageLoaded ? 1 : 0
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.1))'
          }} />
        </div>

        <div style={{ 
          padding: '20px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#2c3e50',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '9px'
            }}>
              {product.name}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#7f8c8d',
              lineHeight: '1.4',
              margin: '0 0 8px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.description || 'No description available'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px'
            }}>
              <span style={{ 
                color: '#27ae60',
                fontWeight: '700',
                fontSize: '20px'
              }}>
                ₹{product.price}
              </span>
              <span style={{ 
                color: '#95a5a6',
                fontSize: '14px',
                textDecoration: 'line-through'
              }}>
                ₹{(product.price * 1.5).toFixed(0)}
              </span>
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              33% OFF
            </span>
          </div>
        </div>
      </Link>

      {isWishlisted && (
        <div style={{
          padding: '8px 20px',
          background: 'linear-gradient(135deg, #ffe6e6, #ffcccc)',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#e74c3c',
          fontWeight: '500'
        }}>
          <FaHeart style={{ fontSize: '12px' }} />
          <span>Added to Wishlist</span>
        </div>
      )}

      {isHovered && (
        <div style={{ padding: '0 20px 20px 20px' }}>
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '14px',
              background: isHovered 
                ? 'linear-gradient(135deg, #ff3f6c, #e91e63)' 
                : 'linear-gradient(135deg, #ff3f6c, #ff5582)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: isHovered 
                ? '0 6px 20px rgba(255, 63, 108, 0.4)' 
                : '0 4px 12px rgba(255, 63, 108, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Add to Cart
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}

export default ProductCard;