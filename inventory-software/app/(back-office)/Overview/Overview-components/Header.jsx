import React from 'react';  

const Header = ({ title, subtitle }) => {  
 return (  
   <header style={{ padding: '20px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>  
     <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{title}</h1>  
     {subtitle && <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>{subtitle}</p>}  
   </header>  
 );  
};  

export default Header;
