"use client";
import React, { useState } from "react";
import SalesActivityCard from "./SalesActivityCard";
import InventorySummaryCard from "./InventorySummaryCard";
import ProductDetailsCard from "./ProductDetailsCard";
import OrderSummaryCard from "./OrderSummaryCard";

function DashboardPage() {
 const [activeTab, setActiveTab] = useState("dashboard");
 const [selectedMenuItem, setSelectedMenuItem] = useState(null);
 const [selectedTimeRange, setSelectedTimeRange] = useState({
   purchases: "last_month",
   sales: "last_month",
 });
 const [menuOpen, setMenuOpen] = useState({
   inventory: false,
   sales: false,
   purchases: false,
 });

 const timeRangeOptions = [
   { value: "last_week", label: "Last Week" },
   { value: "last_month", label: "Last Month" },
   { value: "last_quarter", label: "Last Quarter" },
   { value: "last_year", label: "Last Year" },
 ];

 const salesData = {
   orders: 156,
   topSellers: ["Product A", "Product B", "Product C"],
   lowSales: ["Product X", "Product Y", "Product Z"],
 };

 const inventoryData = {
   inHand: 2500,
   incoming: 500,
   lowStock: [
     { item: "Item 1", percentage: 15 },
     { item: "Item 2", percentage: 25 },
     { item: "Item 3", percentage: 60 },
   ],
 };

 const purchaseOrders = {
   quantity: 450,
   totalCost: 25000,
 };

 const salesOrders = {
   quantity: 380,
   totalRevenue: 45000,
 };

 const handleTimeRangeChange = (type, value) => {
   setSelectedTimeRange((prev) => ({
     ...prev,
     [type]: value,
   }));
 };

 const toggleMenu = (menu) => {
   setMenuOpen((prev) => ({
     ...prev,
     [menu]: !prev[menu],
   }));
 };

 const handleKeyDown = (event, menu) => {
   if (event.key === "Enter" || event.key === " ") {
     event.preventDefault();
     toggleMenu(menu);
   }
   if (event.key === "Escape" && menuOpen[menu]) {
     toggleMenu(menu);
   }
 };

 const handleMenuItemSelect = (item) => {
   setSelectedMenuItem(item);
 };

 const handleTabChange = (tab) => {
   setActiveTab(tab);
 };

 return (
   <div className="flex min-h-screen" style={{ backgroundColor: "#FaFaFa" }}>
     <main role="main" className="flex-1 p-8 mx-auto my-0 max-w-[1200px]">
       <div className="grid gap-8 grid-cols-[repeat(2,1fr)]">
         <SalesActivityCard salesData={salesData} />
         <InventorySummaryCard inventoryData={inventoryData} />
         <ProductDetailsCard inventoryData={inventoryData} />

         <div className="grid col-span-full gap-8 mt-8 grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
           <OrderSummaryCard
             title="Purchase Orders"
             type="purchases"
             data={purchaseOrders}
             selectedTimeRange={selectedTimeRange.purchases}
             timeRangeOptions={timeRangeOptions}
             onTimeRangeChange={(value) =>
               handleTimeRangeChange("purchases", value)
             }
             valueLabel="Total Cost"
             valuePrefix="$"
           />

           <OrderSummaryCard
             title="Sales Orders"
             type="sales"
             data={salesOrders}
             selectedTimeRange={selectedTimeRange.sales}
             timeRangeOptions={timeRangeOptions}
             onTimeRangeChange={(value) =>
               handleTimeRangeChange("sales", value)
             }
             valueLabel="Total Revenue"
             valuePrefix="$"
           />
         </div>
       </div>
     </main>
   </div>
 );
}

export default DashboardPage;
