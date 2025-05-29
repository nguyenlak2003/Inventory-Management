import React from "react";

function InventorySummaryCard({ purchaseOrders, sellOrders }) {
  // Exclude the first row if it's a placeholder or undefined
  const getRowCount = (orders) => {
    if (!orders || orders.length === 0) return 0;
    return orders.filter((order, idx) => idx !== 0 && order !== undefined).length;
  };

  return (
    <article className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <h2 className="mb-5 text-zinc-800">Inventory Summary</h2>
      <div>
        <div>
          <span>In hand: </span>
          <span>{getRowCount(purchaseOrders)}</span>
        </div>
        <div>
          <span>Shipped: </span>
          <span>{getRowCount(sellOrders)}</span>
        </div>
      </div>
    </article>
  );
}

export default InventorySummaryCard;
