import React, { useState } from "react";

function TabNavigation({ tabs, activeTab, setActiveTab, handleTabKeyDown }) {
 const [clickedTab, setClickedTab] = useState(null);

 return (
   <div
     role="tablist"
     className="px-1 py-0 border-b border-solid bg-white border-b-zinc-500 rounded-lg"
   >
     <div className="flex gap-2.5 mx-auto my-0 max-w-[1200px]">
       {tabs.map((tab) => (
         <button
           className="px-8 py-4 text-lg bg-transparent transition-all cursor-pointer border-none duration-[0.3s] rounded-lg"
           role="tab"
           key={tab}
           id={`tab-${tab.toLowerCase()}`}
           aria-controls={`panel-${tab.toLowerCase()}`}
           aria-selected={activeTab === tab}
           onClick={() => {
             setActiveTab(tab);
             setClickedTab(tab);
           }}
           onKeyDown={(event) => handleTabKeyDown(event, tabs)}
           style={{
             borderBottom:
               activeTab === tab
                 ? "3px solid rgb(214, 35, 12)"
                 : "3px solid transparent",
             color: activeTab === tab ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",
             backgroundColor:
               clickedTab === tab ? "rgb(255, 230, 230)" : "transparent",
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
