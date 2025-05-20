"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardView from "./DashboardView";
import InventoryTable from "./InventoryTable";
import AddItemModal from "./AddItemModal";

function InventoryDashboard() {
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDashboard, setShowDashboard] = useState(true);
  const [currentTable, setCurrentTable] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("home");

  // Initial inventory data
  const [inventoryItems, setInventoryItems] = useState({
    electronics: [
      {
        id: 1,
        name: "Laptop",
        sku: "ELEC001",
        stock: 50,
        price: 999.99,
        category: "Electronics",
      },
      {
        id: 2,
        name: "Smartphone",
        sku: "ELEC002",
        stock: 100,
        price: 699.99,
        category: "Electronics",
      },
    ],
    housewares: [
      {
        id: 1,
        name: "Coffee Maker",
        sku: "HOME001",
        stock: 30,
        price: 79.99,
        category: "Housewares",
      },
      {
        id: 2,
        name: "Blender",
        sku: "HOME002",
        stock: 45,
        price: 49.99,
        category: "Housewares",
      },
    ],
    misc: [
      {
        id: 1,
        name: "Office Supplies",
        sku: "MISC001",
        stock: 200,
        price: 19.99,
        category: "Misc",
      },
    ],
  });

  // Table data for different sections
  const [tableData, setTableData] = useState({
    customers: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "555-0123",
        address: "123 Main St",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-0124",
        address: "456 Oak Ave",
      },
    ],
    invoices: [
      {
        id: 1,
        number: "INV001",
        date: "2024-01-15",
        amount: 1299.99,
        status: "Paid",
      },
      {
        id: 2,
        number: "INV002",
        date: "2024-01-20",
        amount: 799.99,
        status: "Pending",
      },
    ],
    employees: [
      {
        id: 1,
        name: "Alice Johnson",
        position: "Sales Manager",
        department: "Sales",
        status: "Active",
      },
      {
        id: 2,
        name: "Bob Wilson",
        position: "Sales Rep",
        department: "Sales",
        status: "Active",
      },
    ],
    providers: [
      {
        id: 1,
        name: "Tech Supplies Inc",
        contact: "Mark Brown",
        phone: "555-0125",
        products: "Electronics",
      },
      {
        id: 2,
        name: "Home Goods Co",
        contact: "Sarah Davis",
        phone: "555-0126",
        products: "Housewares",
      },
    ],
    billings: [
      {
        id: 1,
        number: "BILL001",
        dueDate: "2024-02-01",
        amount: 5000.0,
        status: "Pending",
      },
      {
        id: 2,
        number: "BILL002",
        dueDate: "2024-02-15",
        amount: 3500.0,
        status: "Paid",
      },
    ],
  });

  // Column definitions for tables
  const [columns, setColumns] = useState({
    customers: ["Name", "Email", "Phone", "Address"],
    invoices: ["Number", "Date", "Amount", "Status"],
    information: ["Title", "Description", "Category", "Date"],
    suppliers: ["Company", "Contact", "Phone", "Products"],
    employees: ["Name", "Position", "Department", "Status"],
    bills: ["Number", "Due Date", "Amount", "Paid"],
  });

  // State for visible columns in tables
  const [visibleColumns, setVisibleColumns] = useState({});

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
  });

  // Handle navigation toggle
  const handleNavToggle = () => {
    setIsNavMinimized(!isNavMinimized);
  };

  // Handle tab selection
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowDashboard(tab === "dashboard");
  };

  // Handle menu item selection
  const handleMenuItemSelect = (item, category = null) => {
    setSelectedMenuItem(item);
    if (category) {
      setCurrentTable(category.toLowerCase());
      setShowDashboard(false);
      setActiveTab(category.toLowerCase());
    } else if (item === "home") {
      setActiveTab("dashboard");
      setShowDashboard(true);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Actual search implementation would filter the data
  };

  // Open modal to add new item
  const openAddItemModal = (category) => {
    setCurrentCategory(category);
    setShowAddItemModal(true);
  };

  // Add new item
  const addItem = (category, item) => {
    if (!item.name || !item.sku) {
      alert("Name and SKU are required");
      return false;
    }

    const numPrice = parseFloat(item.price);
    if (isNaN(numPrice) || numPrice < 0) {
      alert("Please enter a valid price");
      return false;
    }

    setInventoryItems((prev) => {
      const newItems = [...(prev[category] || [])];
      newItems.push({
        ...item,
        id: newItems.length + 1,
        stock: 0,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        price: parseFloat(item.price).toFixed(2),
      });
      return {
        ...prev,
        [category]: newItems,
      };
    });

    return true;
  };

  // Remove item
  const removeItem = (category, itemId) => {
    setInventoryItems((prev) => {
      const items = [...prev[category]];
      const index = items.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        items.splice(index, 1);
      }
      return {
        ...prev,
        [category]: items,
      };
    });
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar
        isNavMinimized={isNavMinimized}
        selectedMenuItem={selectedMenuItem}
        onMenuItemSelect={handleMenuItemSelect}
      />

      <main
        role="main"
        className="relative flex-1 p-8 mx-auto my-0 duration-[0.3s] ease-[ease] max-w-[1200px] transition-[padding-left]"
        style={{
          paddingLeft: isNavMinimized ? "80px" : "30px",
        }}
      >
        <button
          className="flex absolute left-0 justify-center items-center text-xl bg-red-600 rounded-none -translate-y-2/4 cursor-pointer border-none duration-[0.2s] ease-[ease] h-[60px] text-white top-[1170px] transition-[background-color] w-[30px]"
          aria-label={
            isNavMinimized ? "Expand navigation" : "Minimize navigation"
          }
          onClick={handleNavToggle}
        >
          {isNavMinimized ? <span>►</span> : <span>◄</span>}
        </button>

        <nav className="flex gap-5 pb-2.5 mb-8 border-b border-solid border-b-zinc-300">
          {["dashboard", "getting started", "announcements", "updates"].map(
            (tab) => (
              <button
                key={tab}
                className="px-5 py-2.5 rounded-md cursor-pointer border-none"
                onClick={() => handleTabChange(tab)}
                style={{
                  backgroundColor:
                    activeTab === tab ? "#d6230c" : "transparent",
                  color: activeTab === tab ? "white" : "#333",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ),
          )}
        </nav>

        <section>
          {/* Table Views */}
          {(activeTab === "customers" ||
            activeTab === "invoice" ||
            activeTab === "employees") && (
            <InventoryTable
              data={tableData[activeTab] || []}
              columns={columns[activeTab] || []}
              title={activeTab}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onAddNew={() => openAddItemModal(activeTab)}
            />
          )}

          {/* Inventory Category View */}
          {!showDashboard &&
            activeTab !== "customers" &&
            activeTab !== "invoice" &&
            activeTab !== "employees" && (
              <div className="p-8 mt-5 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="m-0 text-2xl text-zinc-900">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    Inventory
                  </h2>
                  <button
                    className="px-5 py-2.5 text-base bg-red-600 rounded cursor-pointer border-none duration-[0.2s] text-white transition-[background-color]"
                    onClick={() => openAddItemModal(activeTab)}
                  >
                    Add New Item
                  </button>
                </div>
                <div className="overflow-x-auto max-sm:max-w-[100vw]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-red-600 text-white">
                        <th className="px-4 py-3 text-left">Item Code</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Quantity</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Details</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems[activeTab]?.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-solid border-b-zinc-100"
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "white" : "#f9f9f9",
                          }}
                        >
                          <td className="px-4 py-3">{item.sku}</td>
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.stock}</td>
                          <td className="px-4 py-3">${item.price}</td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">
                            <button
                              className="px-3 py-1.5 text-red-600 bg-transparent rounded border border-red-600 border-solid transition-all cursor-pointer duration-[0.2s]"
                              onClick={() => removeItem(activeTab, item.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Dashboard View */}
          {showDashboard && activeTab === "dashboard" && <DashboardView />}
        </section>
      </main>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <AddItemModal
          category={currentCategory}
          onClose={() => setShowAddItemModal(false)}
          onAdd={(item) => {
            const success = addItem(currentCategory, item);
            if (success) {
              setShowAddItemModal(false);
            }
          }}
        />
      )}
    </div>
  );
}

export default InventoryDashboard;
