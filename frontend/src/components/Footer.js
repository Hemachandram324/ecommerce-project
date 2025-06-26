import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.section}>
        <h4>ABOUT</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Connect Us</a></li>
          <li><a href="#">Policy</a></li>
          <li><a href="#">Corporate Information</a></li>
        </ul>
      </div>
      <div style={styles.section}>
        <h4>Connect with Us</h4>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Instagram</a></li>
        </ul>
      </div>
      <div style={styles.section}>
        <h4>CONSUMER POLICY</h4>
        <ul>
          <li><a href="#">Cancellation & Returns</a></li>
          <li><a href="#">Terms Of Use</a></li>
          <li><a href="#">Security</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Sitemap</a></li>
          <li><a href="#">Become an Affiliate</a></li>
          <li><a href="#">Grievance Redressal</a></li>
          <li><a href="#">Grievance Redressal</a></li>
          <li><a href="#">EPR Compliance</a></li>
        </ul>
      </div>
      <div style={styles.section}>
        <h4>Let Us Help You</h4>
        <ul>
          <li><a href="#">Your Account</a></li>
          <li><a href="#">Returns Centre</a></li>
          <li><a href="#">100% Purchase Protection</a></li>
          <li><a href="#">Payments</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </div>
      <div style={styles.bottomBar}>
        <img src="/images/ecommerceLogo.jpg" alt="Amazon Logo" style={styles.logo} />
        <div style={styles.language}>
          <select style={styles.select}>
            <option>English</option>
          </select>
          <span style={styles.country}>India</span>
        </div>
      </div>
      <div style={styles.subFooter}>
        <div style={styles.subFooterLinks}>
          <a href="#" style={styles.link}><span role="img" aria-label="Become a Seller">🏠</span> Become a Seller</a>
          <a href="#" style={styles.link}><span role="img" aria-label="Advertise">⭐</span> Advertise</a>
          <a href="#" style={styles.link}><span role="img" aria-label="Gift Cards">🎁</span> Gift Cards</a>
          <a href="#" style={styles.link}><span role="img" aria-label="Help Center">❓</span> Help Center</a>
        </div>
        <div style={styles.copyright}>
          © 2007-2025 Mensfashionhub.com
        </div>
        <div style={styles.paymentIcons}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={styles.icon} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="MasterCard" style={styles.icon} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Maestro" style={styles.icon} />
          <a href="#">Cash on Delivery</a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#232f3e',
    color: '#fff',
    padding: '20px 0',
    fontFamily: 'Arial, sans-serif',
    borderTop: '1px solid #ccc',
  },
  section: {
    display: 'inline-block',
    verticalAlign: 'top',
    margin: '0 20px',
    width: '250px',
  },
  h4: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
  },
  li: {
    marginBottom: '5px',
  },
  a: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '12px',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    
    marginTop: '40px',
    padding: '10px 0',
    borderTop: '1px solid #ccc',
  },
  logo: {
    height: '120px',
    marginLeft: '60px',
  },
  language: {
    marginRight: '20px',
  },
  select: {
    backgroundColor: '#232f3e',
    color: '#fff',
    border: '1px solid #fff',
    padding: '5px',
  },
  country: {
    marginLeft: '10px',
    fontSize: '12px',
  },
  subFooter: {
    marginTop: '10px',
    textAlign: 'center',
  },
  subFooterUl: {
    listStyle: 'none',
    padding: 10,
  },
  subFooterLi: {
    display: 'inline',
    marginRight: '15px',
  },
  subFooterA: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '12px',
  },
  paymentIcons: {
    display: 'flex',
    gap: '50px',
  },
  icon: {
    height: '20px',
    width: 'auto',
  },
};

export default Footer;