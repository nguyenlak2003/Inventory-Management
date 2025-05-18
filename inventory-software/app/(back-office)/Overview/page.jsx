"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

function page() {
  const [inventoryItems, setInventoryItems] = useState(() => ({
    electronics: [],
    housewares: [],
    misc: [],
  }));

  const [tableData, setTableData] = useState(() => ({
    customers: [],
    invoices: [],
    information: [],
    suppliers: [],
    employees: [],
    bills: [],
  }));

  const [searchQuery, setSearchQuery] = useState(() => "");

  const [currentTable, setCurrentTable] = useState(() => "");

  const [columns, setColumns] = useState(() => ({
    customers: ["Name", "Email", "Phone", "Address"],
    invoices: ["Number", "Date", "Amount", "Status"],
    information: ["Title", "Description", "Category", "Date"],
    suppliers: ["Company", "Contact", "Phone", "Products"],
    employees: ["Name", "Position", "Department", "Status"],
    bills: ["Number", "Due Date", "Amount", "Paid"],
  }));

  const [visibleColumns, setVisibleColumns] = useState(() => ({}));

  function handleSearch(query) {
    setSearchQuery(query);
    if (currentTable) {
      setTableData((prevData) => ({
        ...prevData,
        [currentTable]: prevData[currentTable].filter((item) =>
          Object.values(item).some((val) =>
            val.toString().toLowerCase().includes(query.toLowerCase()),
          ),
        ),
      }));
    }
  }

  function handleColumnToggle(column) {
    setVisibleColumns((prevColumns) => {
      const current = prevColumns[currentTable] || [];
      if (current.includes(column)) {
        return {
          ...prevColumns,
          [currentTable]: current.filter((col) => col !== column),
        };
      } else {
        return {
          ...prevColumns,
          [currentTable]: [...current, column],
        };
      }
    });
  }

  const [showAddItemModal, setShowAddItemModal] = useState(() => false);

  const [currentCategory, setCurrentCategory] = useState(() => "");

  const [newItem, setNewItem] = useState(() => ({
    name: "",
    sku: "",
    description: "",
    price: "",
  }));

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

    setInventoryItems((prevItems) => {
      const items = [...prevItems[category]];
      items.push({
        ...newItem,
        price: parseFloat(newItem.price).toFixed(2),
      });
      return {
        ...prevItems,
        [category]: items,
      };
    });

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

    setInventoryItems((prevItems) => {
      const items = [...prevItems[category]];
      items.splice(index, 1);
      return {
        ...prevItems,
        [category]: items,
      };
    });
  }

  function openAddItemModal(category) {
    setCurrentCategory(category);
    setShowAddItemModal(true);
  }

  const [activeTab, setActiveTab] = useState(() => "dashboard");

  const [selectedMenuItem, setSelectedMenuItem] = useState(() => null);

  const [selectedTimeRange, setSelectedTimeRange] = useState(() => ({
    purchases: "last_month",
    sales: "last_month",
  }));

  const [timeRangeOptions] = useState(() => [
    {
      value: "last_week",
      label: "Last Week",
    },
    {
      value: "last_month",
      label: "Last Month",
    },
    {
      value: "last_quarter",
      label: "Last Quarter",
    },
    {
      value: "last_year",
      label: "Last Year",
    },
  ]);

  const [menuOpen, setMenuOpen] = useState(() => ({
    inventory: false,
    sales: false,
    purchases: false,
    account: false,
  }));

  function handleKeyDown(event, menu) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu(menu);
    }
    if (event.key === "Escape" && menuOpen[menu]) {
      toggleMenu(menu);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const menuItems = document.querySelectorAll(
        `#${menu}-menu [role="menuitem"]`,
      );
      const currentIndex = Array.from(menuItems).findIndex(
        (item) => item === document.activeElement,
      );
      const nextIndex =
        event.key === "ArrowDown"
          ? (currentIndex + 1) % menuItems.length
          : (currentIndex - 1 + menuItems.length) % menuItems.length;
      menuItems[nextIndex].focus();
    }
  }

  const [salesData] = useState(() => ({
    orders: 156,
    topSellers: ["Product A", "Product B", "Product C"],
    lowSales: ["Product X", "Product Y", "Product Z"],
  }));

  const [inventoryData] = useState(() => ({
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
  }));

  const [purchaseOrders] = useState(() => ({
    quantity: 450,
    totalCost: 25000,
  }));

  const [salesOrders] = useState(() => ({
    quantity: 380,
    totalRevenue: 45000,
  }));

  function toggleMenu(menu) {
    setMenuOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  }

  const [itemIndex, setItemIndex] = useState(() => null);

  useEffect(() => {
    // Initialize chart library
    if (document.getElementById("stockChart")) {
      const ctx = document.getElementById("stockChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: inventoryData.lowStock.map((item) => item.item),
          datasets: [
            {
              data: inventoryData.lowStock.map((item) => item.percentage),
              backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [inventoryData.lowStock]);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className="flex flex-col gap-2.5 p-5 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.1)] w-[250px]"
      >
        <div className="mb-8 text-3xl tracking-tighter text-red-600 font-[bold]">
          <p>InventoryPro</p>
        </div>
        <a
          className="px-5 py-2.5 text-lg no-underline rounded-md transition-all cursor-pointer duration-[0.2s] ease-[ease]"
          href="#"
          role="menuitem"
          tabIndex="0"
          onClick={(event) => {
            event.preventDefault();
            setActiveTab("dashboard");
            setSelectedMenuItem("home");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setActiveTab("dashboard");
              setSelectedMenuItem("home");
            }
          }}
          style={{
            color:
              selectedMenuItem === "home"
                ? "rgb(214, 35, 12)"
                : "rgb(87, 87, 87)",
            backgroundColor:
              selectedMenuItem === "home"
                ? "rgba(214, 35, 12, 0.1)"
                : "transparent",
          }}
        >
          Home
        </a>
        <div role="menuitem">
          <button
            className="px-5 py-2.5 w-full text-left rounded-md transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease]"
            aria-controls="inventory-menu"
            aria-expanded={menuOpen.inventory}
            onKeyDown={(event) => handleKeyDown(event, "inventory")}
            onClick={() => {
              toggleMenu("inventory");
              setSelectedMenuItem("inventory");
            }}
            style={{
              backgroundColor:
                selectedMenuItem === "inventory"
                  ? "rgba(214, 35, 12, 0.1)"
                  : "transparent",
              color:
                selectedMenuItem === "inventory"
                  ? "rgb(214, 35, 12)"
                  : "rgb(87, 87, 87)",
            }}
          >
            Inventory ▼
          </button>
          {menuOpen.inventory ? (
            <div id="inventory-menu" role="menu" className="ml-5">
              {["Electronics", "Housewares", "Misc"]?.map((item) => (
                <a
                  className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
                  href="#"
                  role="menuitem"
                  tabIndex="0"
                  key={item.toLowerCase()}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  style={{
                    color:
                      activeTab === item.toLowerCase()
                        ? "rgb(214, 35, 12)"
                        : "rgb(87, 87, 87)",
                    backgroundColor:
                      activeTab === item.toLowerCase()
                        ? "rgba(214, 35, 12, 0.1)"
                        : "transparent",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div role="menuitem">
          <button
            className="p-2.5 w-full text-left bg-transparent rounded-md cursor-pointer border-[none]"
            aria-controls="sales-menu"
            aria-expanded={menuOpen.sales}
            onKeyDown={(event) => handleKeyDown(event, "sales")}
            onClick={() => {
              toggleMenu("sales");
              setSelectedMenuItem("sales");
            }}
          >
            Sales ▼
          </button>
          {menuOpen.sales ? (
            <div
              id="sales-menu"
              role="menu"
              aria-label="Sales menu"
              className="p-1.5 ml-5 rounded-md bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            >
              <div className="p-2.5">
                <input
                  type="search"
                  placeholder="Search..."
                  className="p-2 mb-2.5 w-full rounded border border-solid border-zinc-300"
                  value={searchQuery}
                  onChange={(event) => handleSearch(event.target.value)}
                />
              </div>
              {["Customers", "Invoices", "Information"]?.map((item) => (
                <a
                  className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
                  href="#"
                  role="menuitem"
                  tabIndex="0"
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  style={{
                    color:
                      activeTab === item.toLowerCase()
                        ? "rgb(214, 35, 12)"
                        : "rgb(87, 87, 87)",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div role="menuitem">
          <button
            className="p-2.5 w-full text-left bg-transparent rounded-md cursor-pointer border-[none]"
            aria-controls="purchases-menu"
            aria-expanded={menuOpen.purchases}
            onKeyDown={(event) => handleKeyDown(event, "purchases")}
            onClick={() => {
              toggleMenu("purchases");
              setSelectedMenuItem("purchases");
            }}
          >
            Purchases ▼
          </button>
          {menuOpen.purchases ? (
            <div id="purchases-menu" role="menu" className="ml-5">
              {["Suppliers", "Employees", "Bills"]?.map((item) => (
                <a
                  className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
                  href="#"
                  role="menuitem"
                  tabIndex="0"
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  style={{
                    color:
                      activeTab === item.toLowerCase()
                        ? "rgb(214, 35, 12)"
                        : "rgb(87, 87, 87)",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <a
          className="px-5 py-2.5 no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
          href="#"
          role="menuitem"
          tabIndex="0"
          onClick={() => setSelectedMenuItem("integration")}
          style={{
            color:
              selectedMenuItem === "integration"
                ? "rgb(214, 35, 12)"
                : "rgb(87, 87, 87)",
            backgroundColor:
              selectedMenuItem === "integration"
                ? "rgba(214, 35, 12, 0.1)"
                : "transparent",
          }}
        >
          Integration
        </a>
        <a
          className="px-5 py-2.5 no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
          href="#"
          role="menuitem"
          tabIndex="0"
          onClick={() => setSelectedMenuItem("reports")}
          style={{
            color:
              selectedMenuItem === "reports"
                ? "rgb(214, 35, 12)"
                : "rgb(87, 87, 87)",
            backgroundColor:
              selectedMenuItem === "reports"
                ? "rgba(214, 35, 12, 0.1)"
                : "transparent",
          }}
        >
          Reports
        </a>
        <div className="pt-5 mt-auto border-t border-solid border-t-red-600 border-t-opacity-10">
          <button
            className="flex justify-between items-center px-5 py-2.5 w-full text-lg bg-transparent rounded-md cursor-pointer border-[none] text-zinc-600"
            aria-expanded={menuOpen.account}
            onClick={() => toggleMenu("account")}
          >
            <span>Account Settings</span>
            <span>▼</span>
          </button>
          {menuOpen.account ? (
            <div className="ml-5">
              <a
                className="px-5 py-2.5 text-base no-underline rounded-md text-zinc-600"
                href="#"
              >
                Manage Account
              </a>
              <a
                className="px-5 py-2.5 text-base no-underline rounded-md text-zinc-600"
                href="#"
              >
                Sign Out
              </a>
            </div>
          ) : null}
        </div>
      </nav>
      <main role="main" className="flex-1 p-8 mx-auto my-0 max-w-[1200px]">
        <div className="flex gap-5 pb-2.5 mb-8 border-b border-solid border-b-zinc-300">
          {["dashboard", "getting started", "announcements", "updates"]?.map(
            (tab) => (
              <button
                className="px-5 py-2.5 rounded-md cursor-pointer border-[none]"
                key={tab}
                onClick={() => setActiveTab(tab)}
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
        </div>
        <div>
          <>
            {activeTab === "electronics" ||
            activeTab === "housewares" ||
            activeTab === "misc" ? (
              <div
                role="region"
                className="p-8 mt-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                aria-label={`${activeTab} inventory`}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-3xl text-zinc-900">
                    <span>
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </span>
                    <span> Inventory</span>
                  </h2>
                  <button
                    className="px-5 py-2.5 text-base rounded-md transition-opacity cursor-pointer bg-[linear-gradient(rgb(170,24,23),rgb(62,18,9))] border-[none] duration-[0.2s] text-zinc-100"
                    onClick={() => openAddItemModal(activeTab)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openAddItemModal(activeTab);
                      }
                    }}
                  >
                    Add Item
                  </button>
                </div>
                <table className="mt-5 w-full border-collapse">
                  <thead>
                    <tr className="bg-red-600 bg-opacity-10 text-zinc-900">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">SKU</th>
                      <th className="p-4 text-left">Description</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems[activeTab]?.map((item, index) => (
                      <tr
                        className="border-b border-solid border-b-zinc-100"
                        key={item.sku}
                      >
                        <td className="p-4">{item.name}</td>
                        <td className="p-4">{item.sku}</td>
                        <td className="p-4">{item.description}</td>
                        <td className="p-4 text-right">
                          <span>$</span>
                          <span>{item.price}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            className="px-2.5 py-1.5 text-red-600 bg-transparent rounded border border-red-600 border-solid transition-all cursor-pointer duration-[0.2s]"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => {
                              removeItem(activeTab, index);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                removeItem(activeTab, index);
                              }
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {!(
              activeTab === "electronics" ||
              activeTab === "housewares" ||
              activeTab === "misc"
            ) ? (
              <div className="grid gap-8 grid-cols-[repeat(2,1fr)]">
                <div className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <h2 className="mb-5 text-zinc-800">
                    Sales Activity Overview
                  </h2>
                  <div className="grid gap-4">
                    <div>
                      <span>Orders: </span>
                      <span>{salesData.orders}</span>
                    </div>
                    <div>
                      <h3>Top Sellers</h3>
                      <ul>
                        {salesData.topSellers?.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <h2 className="mb-5 text-zinc-800">Inventory Summary</h2>
                  <div>
                    <div>
                      <span>In Hand: </span>
                      <span>{inventoryData.inHand}</span>
                    </div>
                    <div>
                      <span>To be Received: </span>
                      <span>{inventoryData.incoming}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-full p-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <h2 className="mb-5 text-zinc-800">Product Details</h2>
                  <div className="flex gap-8">
                    <div className="relative flex-1 h-[200px]">
                      <canvas id="stockChart" />
                    </div>
                    <div className="flex-1">
                      <h3>Stock Levels</h3>
                      {inventoryData.lowStock?.map((item) => (
                        <div className="mb-2.5" key={item.item}>
                          <div>
                            <span>{item.item}</span>
                            <span>: </span>
                            <span>{item.percentage}</span>
                            <span>%</span>
                          </div>
                          <div className="overflow-hidden h-2.5 rounded-md bg-neutral-100">
                            <div
                              className="h-full bg-red-600"
                              style={{
                                width: `${item.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid col-span-full gap-8 mt-8 grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
                  <div className="p-8 text-center rounded-xl transition-transform bg-[white] duration-[0.2s] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <div className="flex gap-4 justify-center items-center mb-5">
                      <h2 className="m-0 text-zinc-800">Purchase Orders</h2>
                      <select
                        className="p-2 rounded-md border border-solid cursor-pointer bg-[white] border-zinc-300 text-zinc-800"
                        id="purchase-time-range"
                        aria-label="Purchase Orders Time Range"
                        value={selectedTimeRange.purchases}
                        onChange={(event) =>
                          setSelectedTimeRange((prev) => ({
                            ...prev,
                            purchases: event.target.value,
                          }))
                        }
                      >
                        {timeRangeOptions?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4 text-lg text-stone-500">
                      <span>Quantity: </span>
                      <span className="text-red-600 font-[bold]">
                        {purchaseOrders.quantity}
                      </span>
                    </div>
                    <div className="text-lg text-stone-500">
                      <span>Total Cost: </span>
                      <span className="text-red-600 font-[bold]">
                        <span>$</span>
                        <span>{purchaseOrders.totalCost.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-8 text-center rounded-xl transition-transform bg-[white] duration-[0.2s] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <div className="flex gap-4 justify-center items-center mb-5">
                      <h2 className="m-0 text-zinc-800">Sales Orders</h2>
                      <select
                        className="p-2 rounded-md border border-solid cursor-pointer bg-[white] border-zinc-300 text-zinc-800"
                        id="sales-time-range"
                        aria-label="Sales Orders Time Range"
                        value={selectedTimeRange.sales}
                        onChange={(event) =>
                          setSelectedTimeRange((prev) => ({
                            ...prev,
                            sales: event.target.value,
                          }))
                        }
                      >
                        {timeRangeOptions?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4 text-lg text-stone-500">
                      <span>Quantity: </span>
                      <span className="text-red-600 font-[bold]">
                        {salesOrders.quantity}
                      </span>
                    </div>
                    <div className="text-lg text-stone-500">
                      <span>Total Revenue: </span>
                      <span className="text-red-600 font-[bold]">
                        <span>$</span>
                        <span>{salesOrders.totalRevenue.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        </div>
      </main>
      {showAddItemModal ? (
        <div
          role="dialog"
          aria-label="Add new inventory item"
          className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddItemModal(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setShowAddItemModal(false);
            }
          }}
        >
          <div className="p-8 w-full rounded-xl bg-[white] max-w-[500px]">
            <h2 className="mb-5 text-2xl text-zinc-900">
              <span>Add New </span>
              <span>
                {currentCategory.charAt(0).toUpperCase() +
                  currentCategory.slice(1)}
              </span>
              <span> Item</span>
            </h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                addItem(currentCategory);
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="mb-1.5 text-zinc-600">
                  Name *
                </label>
                <input
                  className="p-2 w-full rounded-md border border-solid border-zinc-300"
                  id="name"
                  type="text"
                  value={newItem.name}
                  required
                  onChange={(event) =>
                    setNewItem((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-4">
                <label htmlFor="sku" className="mb-1.5 text-zinc-600">
                  SKU *
                </label>
                <input
                  className="p-2 w-full rounded-md border border-solid border-zinc-300"
                  id="sku"
                  type="text"
                  value={newItem.sku}
                  required
                  onChange={(event) =>
                    setNewItem((prev) => ({
                      ...prev,
                      sku: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="mb-1.5 text-zinc-600">
                  Description
                </label>
                <textarea
                  className="p-2 w-full rounded-md border border-solid border-zinc-300 min-h-[100px]"
                  id="description"
                  value={newItem.description}
                  onChange={(event) =>
                    setNewItem((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-5">
                <label htmlFor="price" className="mb-1.5 text-zinc-600">
                  Price *
                </label>
                <input
                  className="p-2 w-full rounded-md border border-solid border-zinc-300"
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  required
                  onChange={(event) =>
                    setNewItem((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-2.5 justify-end">
                <button
                  className="px-4 py-2 text-red-600 rounded-md border border-red-600 border-solid transition-all cursor-pointer bg-[white] duration-[0.2s]"
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md transition-opacity cursor-pointer bg-[linear-gradient(rgb(170,24,23),rgb(62,18,9))] border-[none] duration-[0.2s] text-[white]"
                  type="submit"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default page;
