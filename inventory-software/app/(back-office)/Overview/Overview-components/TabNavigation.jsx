import React from "react";

function TabNavigation({ tabs, activeTab, setActiveTab, handleTabKeyDown }) {
  return (
    <div
      role="tablist"
      className="px-5 py-0 border-b border-solid bg-white border-b-zinc-500"
    >
      <div className="flex gap-2.5 mx-auto my-0 max-w-[1200px]">
        {tabs.map((tab) => (
          <button
            className="px-8 py-4 text-lg bg-transparent transition-all cursor-pointer border-none duration-[0.3s]"
            role="tab"
            key={tab}
            id={`tab-${tab.toLowerCase()}`}
            aria-controls={`panel-${tab.toLowerCase()}`}
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(event) => handleTabKeyDown(event, tabs)}
            style={{
              borderBottom:
                activeTab === tab
                  ? "3px solid rgb(214, 35, 12)"
                  : "3px solid transparent",
              color: activeTab === tab ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;
