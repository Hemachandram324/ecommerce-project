import React from 'react';
import Footer from '../components/Footer';


function ContactUs() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Contact Us</h2>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Customer Support</h3>
          <p style={styles.cardText}>Have questions or need help with your order?</p>
          <p style={styles.contact}><strong>Phone:</strong> <a href="tel:9390890108" style={styles.link}>9390890108</a></p>
          <p style={styles.contact}><strong>Email:</strong> <a href="mailto:hemachandram324@gmail.com" style={styles.link}>hemachandram324@gmail.com</a></p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Business Inquiries</h3>
          <p style={styles.cardText}>Want to collaborate with us? Reach out via email.</p>
          <p style={styles.contact}><strong>Email:</strong> <a href="mailto:hemachandram324@gmail.com" style={styles.link}>hemachandram324@gmail.com</a></p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Working Hours</h3>
          <p style={styles.cardText}>Monday - Saturday</p>
          <p style={styles.cardText}>10:00 AM – 6:00 PM</p>
        </div>
      </div>

      <div style={styles.note}>
        You can also reach us on WhatsApp or through the support section in the app.
      </div>
      {/* Footer */}
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#333',
  },
  heading: {
    fontSize: '32px',
    marginBottom: '30px',
    fontWeight: '600',
    color: '#ff3f6c',
    textAlign: 'center',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  contact: {
    fontSize: '16px',
    marginBottom: '6px',
  },
  link: {
    color: '#ff3f6c',
    textDecoration: 'none',
  },
  note: {
    marginTop: '40px',
    fontStyle: 'italic',
    fontSize: '14px',
    textAlign: 'center',
    color: '#666',
  },
};

export default ContactUs;
