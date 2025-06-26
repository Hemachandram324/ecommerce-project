import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavBar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #3f51b5, #9c27b0, #f44336)',
      padding: '14px 30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/* Logo and Website Name */}
      <Link to="/admin-dashboard" style={{
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
          Men's Fashion Hub - Admin
        </span>
      </Link>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          background: 'none',
          border: '2px solid #fff',
          borderRadius: '6px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '15px',
          color: '#ffffff',
          fontWeight: '500'
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default AdminNavBar;
