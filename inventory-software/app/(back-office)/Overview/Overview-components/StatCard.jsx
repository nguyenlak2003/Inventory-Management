import React from "react";

function StatCard({ title, children, className = "" }) {
  return (
    <div
      className={`p-6 rounded-lg border border-solid bg-white border-red-600 border-opacity-10 shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${className}`}
    >
      <h3 className="mb-4 text-red-600">{title}</h3>
      {children}
    </div>
  );
}

export default StatCard;
