import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';

function NavBar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const categories = ["Jeans", "T-shirts", "Shoes", "Jackets", "Sunglasses", "Caps", "Shirts"];

  // Rotating placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % categories.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setShowProfileMenu(false);
    navigate('/login');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleProfileNavigation = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  const handleCategoryClick = (category) => {
    setSearchTerm(category); // Show selected category in input
    setShowSuggestions(false);
    navigate(`/category/byname?name=${encodeURIComponent(category)}`);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const searchValue = searchTerm.trim();
      setSearchTerm('');
      setShowSuggestions(false);
      navigate(`/category/byname?name=${encodeURIComponent(searchValue)}`);
    }
  };

  const filteredCategories = searchTerm.trim()
    ? categories.filter(cat =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #3f51b5, #9c27b0, #f44336)',
      padding: '14px 30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Logo + Brand */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}>
          <img
            src="/images/ecommerceLogo.jpg"
            alt="Logo"
            style={{ height: '40px', marginRight: '12px', borderRadius: '4px' }}
          />
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}>
            Men's Fashion Hub
          </span>
        </Link>

        {/* Search Bar */}
        <div style={{ position: 'relative', margin: '10px 20px', width: '320px' }}>
          <FaSearch
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#555'
            }}
          />
          <input
            type="text"
            placeholder={`Search "${categories[placeholderIndex]}"`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => setShowSuggestions(true)}
            style={{
              width: '100%',
              padding: '10px 36px 10px 12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          {showSuggestions && filteredCategories.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              maxHeight: '160px',
              overflowY: 'auto',
              zIndex: 1000,
              marginTop: '4px',
              listStyle: 'none',
              padding: 0
            }}>
              {filteredCategories.map(cat => (
                <li key={cat}>
                  <button
                    onMouseDown={() => handleCategoryClick(cat)} // ensures input blur doesn't prevent click
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '14px',
                      gap: '6px'
                    }}
                  >
                    <span role="img" aria-label="search">🔍</span> {cat}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Side Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <Link to="/" style={navLinkStyle}>Home</Link>

          {isAuthenticated && (
            <Link to="/cart" style={{ ...navLinkStyle, display: 'flex', alignItems: 'center' }}>
              <FaShoppingCart style={{ marginRight: '6px' }} /> Cart
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleProfileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                <FaUser style={{ marginRight: '6px' }} /> Profile ▾
              </button>
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '6px',
                  zIndex: 100,
                  padding: '10px 0',
                  minWidth: '170px'
                }}>
                  <button onClick={() => handleProfileNavigation('/myorders')} style={menuButtonStyle}>
                    My Orders
                  </button>
                  <button onClick={() => handleProfileNavigation('/wishlist')} style={menuButtonStyle}>
                    Wishlist
                  </button>
                  <button onClick={() => handleProfileNavigation('/contact')} style={menuButtonStyle}>
                    Contact Us
                  </button>
                  <button onClick={handleLogout} style={{
                    ...menuButtonStyle,
                    marginTop: '8px',
                    color: '#dc3545'
                  }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={navLinkStyle}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Style for navbar links
const navLinkStyle = {
  textDecoration: 'none',
  color: '#ffffff',
  fontWeight: '500',
  fontSize: '15px'
};

// Dropdown menu button style
const menuButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 16px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '15px',
  color: '#333',
  fontWeight: '500',
  whiteSpace: 'nowrap'
};

export default NavBar;
