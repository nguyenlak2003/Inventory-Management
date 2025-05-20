import React, { useState } from 'react';  
import './Sidebar.css'; // Assuming you will style it in a separate CSS file  
import Link from 'next/link';  
import Home from '../Home/page';  

const Sidebar = () => {  
  const [isMinimized, setIsMinimized] = useState(false);  

  const toggleSidebar = () => {  
      setIsMinimized(!isMinimized);  
  };  

  return (  
      <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>  
          {/* Toggle Button */}  
          <button className="toggle-button" onClick={toggleSidebar}>  
              {isMinimized ? '>' : '<'}  
          </button>  

          {/* Top */}  
          <div className="sidebar-header">  
              <h2>{!isMinimized && 'Navigation'}</h2>  
          </div>  

          {/* Body */}  
          <nav className="sidebar-body">  
              <Link href="/(back-office)/Overview/Home/page">  
                  <button className="nav-button">  
                      <span>Trang chủ</span>  
                  </button>  
              </Link>
              
          </nav>
          <nav className="sidebar-body">
              <Link href="/(back-office)/Overview/Home/page">
                  <button className="nav-button">
                      <span>Kho hàng</span>
                  </button>
              </Link> 
          </nav>
      </div>  
  );  
};  

export default Sidebar;
