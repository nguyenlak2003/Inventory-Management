"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function StockChart({ inventoryData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

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

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [inventoryData]);

  return (
    <div style={{ position: "relative", width: "100%", height: "300px" }}>
      <canvas ref={chartRef} id="stockChart" />
    </div>
  );
}

export default StockChart;
