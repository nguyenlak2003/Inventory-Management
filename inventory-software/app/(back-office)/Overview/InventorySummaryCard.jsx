import React from "react";

function InventorySummaryCard({ inventoryData }) {
  return (
    <article className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
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
    </article>
  );
}

export default InventorySummaryCard;
