import React from "react";

function StockLevelIndicator({ item, percentage }) {
  return (
    <div className="mb-2.5">
      <div>
        <span>{item}</span>
        <span>: </span>
        <span>{percentage}</span>
        <span>%</span>
      </div>
          <div className="text-gray-400 overflow-hidden h-2.5 rounded-md bg-neutral-100">
        <div
          className="h-full bg-red-600"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default StockLevelIndicator;
