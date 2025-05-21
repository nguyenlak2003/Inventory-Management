import React from "react";

function TabNavigation({ activeTab, handleTabChange }) {
  const tabs = [
    { id: "customers", label: "Customers" },
    { id: "invoices", label: "Invoices" },
    { id: "information", label: "Information" },
  ];

  return (
    <nav className="flex gap-2.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className="px-5 py-2.5 rounded cursor-pointer border-[none]"
          onClick={() => handleTabChange(tab.id)}
          style={{
            backgroundColor: activeTab === tab.id ? "#E31B23" : "#f5f5f5",
            color: activeTab === tab.id ? "white" : "black",
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default TabNavigation;
