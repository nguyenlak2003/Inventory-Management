import React from "react";

function StockLevelIndicator({ item, percentage }) {
  // Determine color based on percentage
  const getColorClass = (percent) => {
    if (percent < 30) return "bg-red-600";
    if (percent < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center">
        <span className="text-zinc-700">{item}</span>
        <span className="text-zinc-600">{percentage}%</span>
      </div>
      <div className="overflow-hidden h-2.5 rounded-md bg-neutral-100">
        <div
          className={`h-full ${getColorClass(percentage)}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default StockLevelIndicator;
