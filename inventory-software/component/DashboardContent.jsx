"use client";
import React from "react";
import InventoryTable from "./InventoryTable";
import DashboardOverview from "./DashboardOverview";

function DashboardContent({
  activeTab,
  setActiveTab,
  inventoryItems,
  openAddItemModal,
  removeItem,
  selectedTimeRange,
  handleTimeRangeChange,
}) {
  const tabOptions = [
    "dashboard",
    "getting started",
    "announcements",
    "updates",
  ];

  const isInventoryTab = ["electronics", "housewares", "misc"].includes(
    activeTab,
  );

  return (
    <main role="main" className="flex-1 p-8 mx-auto my-0 max-w-[1200px]">
      <div className="flex gap-5 pb-2.5 mb-8 border-b border-solid border-b-zinc-300">
        {tabOptions.map((tab) => (
          <button
            className="px-5 py-2.5 rounded-md cursor-pointer border-[none]"
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              backgroundColor: activeTab === tab ? "#d6230c" : "transparent",
              color: activeTab === tab ? "white" : "#333",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {isInventoryTab ? (
          <InventoryTable
            activeTab={activeTab}
            inventoryItems={inventoryItems[activeTab] || []}
            openAddItemModal={() => openAddItemModal(activeTab)}
            removeItem={(index) => removeItem(activeTab, index)}
          />
        ) : (
          <DashboardOverview
            selectedTimeRange={selectedTimeRange}
            handleTimeRangeChange={handleTimeRangeChange}
          />
        )}
      </div>
    </main>
  );
}

export default DashboardContent;
