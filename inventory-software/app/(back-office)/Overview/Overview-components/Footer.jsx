import React from 'react';

const Footer = () => {
 return (
   <footer style={styles.footer}>
     <p style={styles.text}>© {new Date().getFullYear()} Inventory Management. All rights reserved.</p>
   </footer>
 );
};

const styles = {
 footer: {
   backgroundColor: '#f8f9fa',
   padding: '10px 20px',
   textAlign: 'center',
   borderTop: '1px solid #e9ecef',
 },
 text: {
   margin: 0,
   color: '#6c757d',
   fontSize: '14px',
 },
};

export default Footer;
