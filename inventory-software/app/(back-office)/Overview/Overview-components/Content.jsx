import React from 'react';  
//import StatCard from './StatsCard';  
import StockCard from './StockChart';  

const Content = () => {  
return (  
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>  
    {/* <StatCard /> */}  
    <StockCard />  
  </div>  
);  
};  

export default Content;
