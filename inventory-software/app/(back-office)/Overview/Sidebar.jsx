"use client";
import React, { useState } from "react";
import NavItem from "./NavItem";
import CollapsibleMenu from "./CollapsibleMenu";

function Sidebar({ selectedMenuItem, setSelectedMenuItem }) {
  const [menuOpen, setMenuOpen] = useState({
    inventory: false,
    sales: false,
    purchases: false,
  });

  const toggleMenu = (menu) => {
    setMenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleKeyDown = (event, menu) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu(menu);
    }
    if (event.key === "Escape" && menuOpen[menu]) {
      toggleMenu(menu);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
          className="text-gray-400 flex flex-col gap-2.5 p-5 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.1)] w-[250px]"
    >
      <header className="mb-8 text-3xl tracking-tighter text-red-600 font-[bold]">
        <p>InventoryPro</p>
      </header>

      <NavItem
        label="Home"
        isSelected={selectedMenuItem === "home"}
        onClick={() => setSelectedMenuItem("home")}
      />

      <CollapsibleMenu
        label="Inventory"
        isOpen={menuOpen.inventory}
        isSelected={selectedMenuItem === "inventory"}
        onToggle={() => {
          toggleMenu("inventory");
          setSelectedMenuItem("inventory");
        }}
        onKeyDown={(event) => handleKeyDown(event, "inventory")}
        menuItems={["Electronics", "Housewares", "Mics"]}
      />

      <CollapsibleMenu
        label="Sales"
        isOpen={menuOpen.sales}
        isSelected={selectedMenuItem === "sales"}
        onToggle={() => {
          toggleMenu("sales");
          setSelectedMenuItem("sales");
        }}
        onKeyDown={(event) => handleKeyDown(event, "sales")}
        menuItems={["Customers", "Invoices", "Information"]}
      />

      <CollapsibleMenu
        label="Purchases"
        isOpen={menuOpen.purchases} 
        isSelected={selectedMenuItem === "purchases"}
        onToggle={() => {
          toggleMenu("purchases");
          setSelectedMenuItem("purchases");
        }}
        onKeyDown={(event) => handleKeyDown(event, "purchases")}
        menuItems={["Suppliers", "Employees", "Bills"]}
      />

      <NavItem
        label="Integration"
        isSelected={selectedMenuItem === "integration"}
        onClick={() => setSelectedMenuItem("integration")}
      />

      <NavItem
        label="Reports"
        isSelected={selectedMenuItem === "reports"}
        onClick={() => setSelectedMenuItem("reports")}
      />

      <NavItem
        label="Documents"
        isSelected={selectedMenuItem === "documents"}
        onClick={() => setSelectedMenuItem("documents")}
      />
    </nav>
  );
}

export default Sidebar;
