"use client";
import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import StockChart from "./StockChart";

function DashboardOverview({ selectedTimeRange, handleTimeRangeChange }) {
  const [salesData] = useState({
    orders: 156,
    topSellers: ["Product A", "Product B", "Product C"],
    lowSales: ["Product X", "Product Y", "Product Z"],
  });

  const [inventoryData] = useState({
    inHand: 2500,
    incoming: 500,
    lowStock: [
      {
        item: "Item 1",
        percentage: 15,
      },
      {
        item: "Item 2",
        percentage: 25,
      },
      {
        item: "Item 3",
        percentage: 60,
      },
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

  const [timeRangeOptions] = useState([
    {
      value: "last_week",
      label: "Last Week",
    },
    {
      value: "last_month",
      label: "Last Month",
    },
    {
      value: "last_quarter",
      label: "Last Quarter",
    },
    {
      value: "last_year",
      label: "Last Year",
    },
  ]);

  return (
    <div className="grid gap-8 grid-cols-[repeat(2,1fr)]">
      <div className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h2 className="mb-5 text-zinc-800">Sales Activity Overview</h2>
        <div className="grid gap-4">
          <div>
            <span>Orders: </span>
            <span>{salesData.orders}</span>
          </div>
          <div>
            <h3>Top Sellers</h3>
            <ul>
              {salesData.topSellers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h2 className="mb-5 text-zinc-800">Inventory Summary</h2>
        <div>
          <div>
            <span>In Hand: </span>
            <span>{inventoryData.inHand}</span>
          </div>
          <div>
            <span>To be Received: </span>
            <span>{inventoryData.incoming}</span>
          </div>
        </div>
      </div>

      <div className="col-span-full p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <h2 className="mb-5 text-zinc-800">Product Details</h2>
        <div className="flex gap-8">
          <div className="relative flex-1 h-[200px]">
            <StockChart inventoryData={inventoryData} />
          </div>
          <div className="flex-1">
            <h3>Stock Levels</h3>
            {inventoryData.lowStock.map((item) => (
              <div className="mb-2.5" key={item.item}>
                <div>
                  <span>{item.item}</span>
                  <span>: </span>
                  <span>{item.percentage}</span>
                  <span>%</span>
                </div>
                <div className="overflow-hidden h-2.5 rounded-md bg-neutral-100">
                  <div
                    className="h-full bg-red-600"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid col-span-full gap-8 mt-8 grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        <StatsCard
          title="Purchase Orders"
          timeRange={selectedTimeRange.purchases}
          onTimeRangeChange={(value) =>
            handleTimeRangeChange("purchases", value)
          }
          timeRangeOptions={timeRangeOptions}
          quantity={purchaseOrders.quantity}
          amount={purchaseOrders.totalCost}
          amountLabel="Total Cost"
        />

        <StatsCard
          title="Sales Orders"
          timeRange={selectedTimeRange.sales}
          onTimeRangeChange={(value) => handleTimeRangeChange("sales", value)}
          timeRangeOptions={timeRangeOptions}
          quantity={salesOrders.quantity}
          amount={salesOrders.totalRevenue}
          amountLabel="Total Revenue"
        />
      </div>
    </div>
  );
}

export default DashboardOverview;
