"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import AddItemModal from "./AddItemModal";

function InventoryDashboard() {
  const [inventoryItems, setInventoryItems] = useState(() => ({
    electronics: [],
    housewares: [],
    misc: [],
  }));
   const [salesItems, setSalesItems] = useState(() => ({
    customers: [],
    invoices: [],
    information: [],
   }))
  const [purchaseItems, setPurChaseItems] = useState(() => ({
    suppliers: [],
    employees: [],
    bills: [],
  }));

  const [searchQuery, setSearchQuery] = useState(() => "");
  const [currentTable, setCurrentTable] = useState(() => "");
  const [activeTab, setActiveTab] = useState(() => "dashboard");
  const [selectedMenuItem, setSelectedMenuItem] = useState(() => null);
  const [showAddItemModal, setShowAddItemModal] = useState(() => false);
  const [currentCategory, setCurrentCategory] = useState(() => "");

  const [columns, setColumns] = useState(() => ({
    customers: ["Name", "Email", "Phone", "Address"],
    invoices: ["Number", "Date", "Amount", "Status"],
    information: ["Title", "Description", "Category", "Date"],
    suppliers: ["Company", "Contact", "Phone", "Products"],
    employees: ["Name", "Position", "Department", "Status"],
    bills: ["Number", "Due Date", "Amount", "Paid"],
  }));

  const [visibleColumns, setVisibleColumns] = useState(() => ({}));
  const [newItem, setNewItem] = useState(() => ({
    name: "",
    sku: "",
    description: "",
    price: "",
  }));

  const [selectedTimeRange, setSelectedTimeRange] = useState(() => ({
    purchases: "last_month",
    sales: "last_month",
  }));

  const [menuOpen, setMenuOpen] = useState(() => ({
    inventory: false,
    sales: false,
    purchases: false,
    account: false,
  }));

  const [$index, set$index] = useState(() => null);

  function handleSearch(query) {
    setSearchQuery(query);
    if (currentTable) {
      tableData[currentTable] = tableData[currentTable].filter((item) =>
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }
  }

  function handleColumnToggle(column) {
    const current = visibleColumns[currentTable];
    if (current.includes(column)) {
      visibleColumns[currentTable] = current.filter((col) => col !== column);
    } else {
      visibleColumns[currentTable] = [...current, column];
    }
  }

  function validatePrice(price) {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice >= 0;
  }

  function addItem(category) {
    if (!newItem.name || !newItem.sku) {
      alert("Name and SKU are required");
      return;
    }
    if (!validatePrice(newItem.price)) {
      alert("Please enter a valid price");
      return;
    }
    const items = [...inventoryItems[category]];
    items.push({
      ...newItem,
      price: parseFloat(newItem.price).toFixed(2),
    });

    setInventoryItems((prev) => ({
      ...prev,
      [category]: items,
    }));

    setNewItem({
      name: "",
      sku: "",
      description: "",
      price: "",
    });
    setShowAddItemModal(false);
  }

  function removeItem(category, index) {
    if (index < 0 || index >= inventoryItems[category].length) return;
    const items = [...inventoryItems[category]];
    items.splice(index, 1);

    setInventoryItems((prev) => ({
      ...prev,
      [category]: items,
    }));
  }

  function openAddItemModal(category) {
    setCurrentCategory(category);
    setShowAddItemModal(true);
  }

  function toggleMenu(menu) {
    setMenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  }

  function handleTimeRangeChange(type, value) {
    setSelectedTimeRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={setSelectedMenuItem}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
      />

      <DashboardContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inventoryItems={inventoryItems}
        openAddItemModal={openAddItemModal}
        removeItem={removeItem}
        selectedTimeRange={selectedTimeRange}
        handleTimeRangeChange={handleTimeRangeChange}
      />

      {showAddItemModal && (
        <AddItemModal
          currentCategory={currentCategory}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={addItem}
          setShowAddItemModal={setShowAddItemModal}
        />
      )}
    </div>
  );
}

export default InventoryDashboard;
