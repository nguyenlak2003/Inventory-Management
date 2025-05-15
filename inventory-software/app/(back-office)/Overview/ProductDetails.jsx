"use client";
import React, { useEffect, useRef } from "react";
import StockLevelIndicator from "./StockLevelIndicator";

function ProductDetails({ inventoryData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Dynamically import Chart.js to avoid SSR issues
    const loadChart = async () => {
      if (typeof window !== "undefined") {
        try {
          const Chart = (await import("chart.js/auto")).default;

          // If we already have a chart instance, destroy it before creating a new one
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          const ctx = chartRef.current.getContext("2d");

          chartInstance.current = new Chart(ctx, {
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
        } catch (error) {
          console.error("Failed to load Chart.js:", error);
        }
      }
    };

    loadChart();

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [inventoryData]);

  return (
      <section className="text-gray-400 col-span-full p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <h2 className="mb-5 text-zinc-800">Product Details</h2>
      <div className="flex gap-8">
        <div className="relative flex-1 h-[200px]">
          <canvas ref={chartRef} id="stockChart" />
        </div>
        <div className="flex-1">
          <h3>Stock Levels</h3>
          {inventoryData.lowStock?.map((item) => (
            <StockLevelIndicator
              key={item.item}
              item={item.item}
              percentage={item.percentage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
