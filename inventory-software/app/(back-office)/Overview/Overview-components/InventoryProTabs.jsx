"use client";
import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import WelcomeTab from "./WelcomeTab";
import AboutTab from "./AboutTab";
import ContactTab from "./ContactTab";
import ReviewTab from "./ReviewTab";

function InventoryProTabs() {
 const [activeTab, setActiveTab] = useState("Welcome");
 const tabs = ["Welcome", "About", "Contact", "Review"];

 const handleTabKeyDown = (event, tabs) => {
   const currentIndex = tabs.indexOf(activeTab);
   if (event.key === "ArrowRight") {
     event.preventDefault();
     setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
   } else if (event.key === "ArrowLeft") {
     event.preventDefault();
     setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
   }
 };

 return (
   <div className="min-h-screen" style={{ backgroundColor: "#FAFAF9" }}>
     <TabNavigation
       tabs={tabs}
       activeTab={activeTab}
       setActiveTab={setActiveTab}
       handleTabKeyDown={handleTabKeyDown}
     />
     <main className="px-5 py-8 mx-auto my-0 max-w-[1200px]">
       {activeTab === "Welcome" && <WelcomeTab />}
       {activeTab === "About" && <AboutTab />}
       {activeTab === "Contact" && <ContactTab />}
       {activeTab === "Review" && <ReviewTab />}
     </main>
   </div>
 );
}

export default InventoryProTabs;
