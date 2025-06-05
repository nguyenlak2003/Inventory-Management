"use client";
import React, { useState } from "react";
import StatCard from "./StatCard";

function WelcomeTab() {
  const [inventoryData] = useState({
    inHand: 2500,
    incoming: 500,
    lowStock: [
      {
        item: "Item 1",
        percentage: 15,
      },
      {
        item: "Item 2",
        percentage: 25,
      },
      {
        item: "Item 3",
        percentage: 60,
      },
    ],
  });

  const [salesData] = useState({
    orders: 156,
    topSellers: ["Product A", "Product B", "Product C"],
    lowSales: ["Product X", "Product Y", "Product Z"],
  });

  return (
    <section role="tabpanel" id="panel-welcome" aria-labelledby="tab-welcome">
      <h2 className="mb-6 text-3xl text-zinc-900">Welcome to Inventory Pro</h2>
      <img
        alt="Modern inventory management system"
        src="https://images.pexels.com/photos/6169641/pexels-photo-6169641.jpeg"
        className="object-cover overflow-hidden mb-8 w-full rounded-lg aspect-square shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
      />
      <div className="grid gap-5 mb-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <StatCard title="Quick Stats">
          <p>
            <span>Total Items: </span>
            <span>{inventoryData.inHand}</span>
          </p>
          <p>
            <span>Incoming Stock: </span>
            <span>{inventoryData.incoming}</span>
          </p>
          <p>
            <span>Recent Orders: </span>
            <span>{salesData.orders}</span>
          </p>
        </StatCard>
        <StatCard title="Top Sellers">
          <ul className="p-0">
            {salesData.topSellers?.map((item) => (
              <li className="mb-2" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </StatCard>
      </div>
    </section>
  );
}

export default WelcomeTab;
