"use client";
import React, { useEffect } from "react";
import Chart from "chart.js/auto";

function StockLevelIndicator({ item }) {
  return (
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
  );
}

function ProductDetailsCard({ inventoryData }) {
  useEffect(() => {
    // Initialize chart library
    const ctx = document.getElementById("stockChart").getContext("2d");

    // Destroy existing chart if it exists
    const chartStatus = Chart.getChart("stockChart");
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: inventoryData.lowStock.map((item) => item.item),
        datasets: [
          {
            data: inventoryData.lowStock.map((item) => item.percentage),
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [inventoryData]);

  return (
    <article className="col-span-full p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <h2 className="mb-5 text-zinc-800">Product Details</h2>
      <div className="flex gap-8">
        <div className="relative flex-1 h-[200px]">
          <canvas id="stockChart" />
        </div>
        <div className="flex-1">
          <h3>Stock Levels</h3>
          {inventoryData.lowStock?.map((item) => (
            <StockLevelIndicator key={item.item} item={item} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default ProductDetailsCard;
