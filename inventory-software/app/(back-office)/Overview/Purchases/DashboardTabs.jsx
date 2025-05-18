import React from "react";

function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = ["dashboard", "getting started", "announcements", "updates"];

  return (
    <div className="flex gap-5 pb-2.5 mb-8 border-b border-solid border-b-zinc-300">
      {tabs.map((tab) => (
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
  );
}

export default DashboardTabs;
