"use client";
import React, { useEffect, useRef } from "react";

function MockChart({ data, labels, colors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw a simple pie chart
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Add legend
    const legendY = 210;
    labels.forEach((label, index) => {
      const legendX = 20 + index * 80;

      // Draw color box
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, legendY, 15, 15);

      // Draw label
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.fillText(label, legendX + 20, legendY + 12);
    });
  }, [data, labels, colors]);

  return (
    <canvas
      ref={canvasRef}
      width="300"
      height="250"
      className="mx-auto"
      aria-label="Stock level chart"
      role="img"
    />
  );
}

export default MockChart;
