"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardTabs from "./DashboardTabs";
import SalesOverview from "./SalesOverview";
import InventorySummary from "./InventorySummary";
import ProductDetails from "./ProductDetails";
import OrderSummary from "./OrderSummary";

function page    () {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [selectedTimeRange, setSelectedTimeRange] = useState({
    purchases: "last_month",
    sales: "last_month",
  });

  const timeRangeOptions = [
    { value: "last_week", label: "Last Week" },
    { value: "last_month", label: "Last Month" },
    { value: "last_quarter", label: "Last Quarter" },
    { value: "last_year", label: "Last Year" },
  ];

  const [salesData] = useState({
    orders: 156,
    topSellers: ["Product A", "Product B", "Product C"],
    lowSales: ["Product X", "Product Y", "Product Z"],
  });

  const [inventoryData] = useState({
    inHand: 2500,
    incoming: 500,
    lowStock: [
      { item: "Item 1", percentage: 15 },
      { item: "Item 2", percentage: 25 },
      { item: "Item 3", percentage: 60 },
    ],
  });

  const [purchaseOrders] = useState({
    quantity: 450,
    totalCost: 25000,
  });

  const [salesOrders] = useState({
    quantity: 380,
    totalRevenue: 45000,
  });

  const handleTimeRangeChange = (type, value) => {
    setSelectedTimeRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={setSelectedMenuItem}
      />

      <main role="main" className="flex-1 p-8 mx-auto my-0 max-w-[1200px]">
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid gap-8 grid-cols-[repeat(2,1fr)]">
          <SalesOverview salesData={salesData} />
          <InventorySummary inventoryData={inventoryData} />

          <ProductDetails inventoryData={inventoryData} />

          <div className="grid col-span-full gap-8 mt-8 grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
            <OrderSummary
              title="Purchase Orders"
              quantity={purchaseOrders.quantity}
              totalAmount={purchaseOrders.totalCost}
              amountLabel="Total Cost"
              timeRange={selectedTimeRange.purchases}
              timeRangeOptions={timeRangeOptions}
              onTimeRangeChange={(value) =>
                handleTimeRangeChange("purchases", value)
              }
            />

            <OrderSummary
              title="Sales Orders"
              quantity={salesOrders.quantity}
              totalAmount={salesOrders.totalRevenue}
              amountLabel="Total Revenue"
              timeRange={selectedTimeRange.sales}
              timeRangeOptions={timeRangeOptions}
              onTimeRangeChange={(value) =>
                handleTimeRangeChange("sales", value)
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default page;
