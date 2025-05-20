"use client";
import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import StockLevelIndicator from "./StockLevelIndicator";

function DashboardView() {
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

  // Mock chart implementation
  useEffect(() => {
    // This is a placeholder for chart initialization
    // In a real implementation, we would use a chart library
    const mockChart = {
      render: () => {
        console.log("Chart rendered");
      },
    };

    // Create a mock canvas element if it doesn't exist
    if (!document.getElementById("stockChart")) {
      const canvas = document.createElement("canvas");
      canvas.id = "stockChart";
      const container = document.getElementById("chart-container");
      if (container) {
        container.appendChild(canvas);
      }
    }

    mockChart.render();

    return () => {
      // Cleanup function
    };
  }, []);

  const handleTimeRangeChange = (type, value) => {
    setSelectedTimeRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
      {/* Sales Activity Overview */}
      <section className="p-5 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h2 className="mb-5 text-xl font-semibold text-zinc-800">
          Sales Activity Overview
        </h2>
        <div className="grid gap-4">
          <div className="text-lg">
            <span className="font-medium">Orders: </span>
            <span className="text-red-600">{salesData.orders}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Top Sellers</h3>
            <ul className="list-disc pl-5">
              {salesData.topSellers.map((item) => (
                <li key={item} className="text-zinc-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Inventory Summary */}
      <section className="p-5 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h2 className="mb-5 text-xl font-semibold text-zinc-800">
          Inventory Summary
        </h2>
        <div className="space-y-3">
          <div className="text-lg">
            <span className="font-medium">In Hand: </span>
            <span className="text-red-600">{inventoryData.inHand}</span>
          </div>
          <div className="text-lg">
            <span className="font-medium">To be Received: </span>
            <span className="text-red-600">{inventoryData.incoming}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="col-span-full p-5 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h2 className="mb-5 text-xl font-semibold text-zinc-800">
          Product Details
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div id="chart-container" className="relative flex-1 h-[200px]">
            {/* Chart will be rendered here by useEffect */}
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
              Stock Level Chart
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-3">Stock Levels</h3>
            {inventoryData.lowStock.map((item) => (
              <StockLevelIndicator
                key={item.item}
                item={item.item}
                percentage={item.percentage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Cards */}
      <div className="grid col-span-full gap-8 mt-8 grid-cols-1 md:grid-cols-2">
        <MetricCard
          title="Purchase Orders"
          timeRange={selectedTimeRange.purchases}
          timeRangeOptions={timeRangeOptions}
          onTimeRangeChange={(value) =>
            handleTimeRangeChange("purchases", value)
          }
          metrics={[
            { label: "Quantity", value: purchaseOrders.quantity },
            {
              label: "Total Cost",
              value: `$${purchaseOrders.totalCost.toLocaleString()}`,
            },
          ]}
        />

        <MetricCard
          title="Sales Orders"
          timeRange={selectedTimeRange.sales}
          timeRangeOptions={timeRangeOptions}
          onTimeRangeChange={(value) => handleTimeRangeChange("sales", value)}
          metrics={[
            { label: "Quantity", value: salesOrders.quantity },
            {
              label: "Total Revenue",
              value: `$${salesOrders.totalRevenue.toLocaleString()}`,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default DashboardView;
