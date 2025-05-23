"use client";
import React, { useState, useEffect, useRef } from "react";
import StatCard from "./StatCard";

function ReviewTab() {
  const [salesOrders] = useState({
    quantity: 380,
    totalRevenue: 45000,
  });

  const chartRef = useRef(null);
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

  useEffect(() => {
    // This is a placeholder for Chart initialization
    // In a real implementation, you would initialize the chart library here
    // For now, we'll just log a message
    console.log("Chart would be initialized here");

    // The original code referenced a Chart library:
    // const ctx = document.getElementById("stockChart").getContext("2d");
    // new Chart(ctx, {
    //   type: "pie",
    //   data: {
    //     labels: inventoryData.lowStock.map((item) => item.item),
    //     datasets: [
    //       {
    //         data: inventoryData.lowStock.map((item) => item.percentage),
    //         backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //   },
    // });
  }, []);

  return (
    <section role="tabpanel" id="panel-review" aria-labelledby="tab-review">
      <h2 className="mb-6 text-3xl text-zinc-900">System Review</h2>
      <img
        alt="System analytics dashboard"
        src="https://images.pexels.com/photos/8068691/pexels-photo-8068691.jpeg"
        className="object-cover overflow-hidden mb-8 w-full rounded-lg aspect-square shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
      />
      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <StatCard title="Performance Metrics">
          <p>
            <span>Orders Processed: </span>
            <span>{salesOrders.quantity}</span>
          </p>
          <p>
            <span>Total Revenue: $</span>
            <span>{salesOrders.totalRevenue}</span>
          </p>
        </StatCard>
      </div>
      <div className="mt-8">
        <canvas
          id="stockChart"
          width="400"
          height="200"
          ref={chartRef}
        ></canvas>
      </div>
    </section>
  );
}

export default ReviewTab;
