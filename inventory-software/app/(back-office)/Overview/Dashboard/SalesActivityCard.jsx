import React from "react";

function SalesActivityCard({ salesData }) {
  return (
    <article className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <h2 className="mb-5 text-zinc-800">Sales Activity Overview</h2>
      <div className="grid gap-4">
        <div>
          <span>Orders: </span>
          <span>{salesData.orders}</span>
        </div>
        <div>
          <h3>Top Sellers</h3>
          <ul>
            {salesData.topSellers?.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default SalesActivityCard;
