"use client";
import React, { useState } from "react";

function DataManagementDashboard() {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchQuery, setSearchQuery] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "555-0123",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-0124",
      status: "Active",
    },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      number: "INV-001",
      amount: 1500,
      date: "2024-01-15",
      status: "Paid",
    },
    {
      id: 2,
      number: "INV-002",
      amount: 2300,
      date: "2024-01-20",
      status: "Pending",
    },
  ]);

  const [information, setInformation] = useState([
    {
      id: 1,
      title: "Customer Policy",
      description: "Standard terms and conditions",
      category: "Policy",
    },
    {
      id: 2,
      title: "Return Policy",
      description: "Product return guidelines",
      category: "Policy",
    },
  ]);

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Supplier Co",
      contact: "Bob Wilson",
      email: "bob@supplier.com",
    },
    {
      id: 2,
      name: "Parts Inc",
      contact: "Alice Brown",
      email: "alice@parts.com",
    },
  ]);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Mike Johnson",
      position: "Sales Manager",
      department: "Sales",
    },
    {
      id: 2,
      name: "Sarah Davis",
      position: "Inventory Specialist",
      department: "Operations",
    },
  ]);

  const [bills, setBills] = useState([
    {
      id: 1,
      number: "BILL-001",
      amount: 5000,
      dueDate: "2024-02-01",
      status: "Unpaid",
    },
    {
      id: 2,
      number: "BILL-002",
      amount: 3500,
      dueDate: "2024-02-15",
      status: "Paid",
    },
  ]);

  const [editingItem, setEditingItem] = useState(null);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setEditingItem(null);
  }

  function handleSearch(event) {
    setSearchQuery(event.target.value.toLowerCase());
  }

  function getFilteredData() {
    let data;
    switch (activeTab) {
      case "customers":
        data = customers;
        break;
      case "invoices":
        data = invoices;
        break;
      case "information":
        data = information;
        break;
      default:
        data = [];
    }

    if (!searchQuery) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery),
      ),
    );
  }

  function handleKeyDown(e, callback) {
    if (e.key === "Escape") {
      callback();
    }
  }

  function startEdit(item) {
    setEditingItem({
      ...item,
    });
  }

  function saveEdit() {
    if (!editingItem) return;

    switch (activeTab) {
      case "customers":
        setCustomers(
          customers.map((item) =>
            item.id === editingItem.id ? editingItem : item,
          ),
        );
        break;
      case "invoices":
        setInvoices(
          invoices.map((item) =>
            item.id === editingItem.id ? editingItem : item,
          ),
        );
        break;
      case "information":
        setInformation(
          information.map((item) =>
            item.id === editingItem.id ? editingItem : item,
          ),
        );
        break;
    }
    setEditingItem(null);
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  function addNewItem() {
    const newItem = {
      id: Date.now(),
    };

    switch (activeTab) {
      case "customers":
        setCustomers([
          ...customers,
          {
            ...newItem,
            name: "",
            email: "",
            phone: "",
            status: "Active",
          },
        ]);
        break;
      case "invoices":
        setInvoices([
          ...invoices,
          {
            ...newItem,
            number: "",
            amount: 0,
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
          },
        ]);
        break;
      case "information":
        setInformation([
          ...information,
          {
            ...newItem,
            title: "",
            description: "",
            category: "",
          },
        ]);
        break;
    }
  }

  function removeItem(id) {
    switch (activeTab) {
      case "customers":
        setCustomers(customers.filter((item) => item.id !== id));
        break;
      case "invoices":
        setInvoices(invoices.filter((item) => item.id !== id));
        break;
      case "information":
        setInformation(information.filter((item) => item.id !== id));
        break;
    }
  }

  function handleEditingChange(field, value) {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      [field]: value,
    });
  }

  return (
    <section className="p-5">
      <div className="flex gap-5 mb-8">
        <div className="relative">
          <label htmlFor="search-input" className="absolute left-[-9999px]">
            <span>Search </span>
            <span>{activeTab}</span>
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search..."
            className="py-2.5 pr-2.5 pl-9 rounded border border-solid border-zinc-300 w-[300px]"
            value={searchQuery}
            aria-label={`Search ${activeTab}`}
            onChange={handleSearch}
          />
          <span className="absolute left-2.5 top-2/4 -translate-y-2/4 text-stone-500">
            🔍
          </span>
        </div>
        <nav className="flex gap-2.5">
          <button
            className="px-5 py-2.5 rounded cursor-pointer border-[none]"
            onClick={() => handleTabChange("customers")}
            style={{
              backgroundColor:
                activeTab === "customers" ? "#E31B23" : "#f5f5f5",
              color: activeTab === "customers" ? "white" : "black",
            }}
          >
            Customers
          </button>
          <button
            className="px-5 py-2.5 rounded cursor-pointer border-[none]"
            onClick={() => handleTabChange("invoices")}
            style={{
              backgroundColor: activeTab === "invoices" ? "#E31B23" : "#f5f5f5",
              color: activeTab === "invoices" ? "white" : "black",
            }}
          >
            Invoices
          </button>
          <button
            className="px-5 py-2.5 rounded cursor-pointer border-[none]"
            onClick={() => handleTabChange("information")}
            style={{
              backgroundColor:
                activeTab === "information" ? "#E31B23" : "#f5f5f5",
              color: activeTab === "information" ? "white" : "black",
            }}
          >
            Information
          </button>
        </nav>
      </div>
      <section className="p-5 rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <header className="flex justify-between mb-5">
          <h2 className="m-0">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button
            className="px-4 py-2 bg-red-600 rounded cursor-pointer border-[none] text-[white]"
            onClick={addNewItem}
          >
            Add New
          </button>
        </header>
        <table
          role="grid"
          className="w-full border-collapse"
          aria-label={`${activeTab} table`}
        >
          <thead>
            <tr className="text-left border-b-2 border-solid border-b-zinc-100">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Details</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData().map((item) => (
              <tr
                className="border-b border-solid border-b-zinc-100"
                key={item.id}
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">
                  {editingItem?.id === item.id ? (
                    <input
                      className="p-1 w-full"
                      value={editingItem.name || editingItem.title || ""}
                      onChange={(e) =>
                        handleEditingChange(
                          activeTab === "information" ? "title" : "name",
                          e.target.value,
                        )
                      }
                    />
                  ) : (
                    <span>{item.name || item.title || item.number}</span>
                  )}
                </td>
                <td className="p-3">
                  {editingItem?.id === item.id ? (
                    <>
                      {activeTab === "customers" && (
                        <div className="flex gap-2.5">
                          <input
                            placeholder="Email"
                            className="p-1"
                            value={editingItem.email || ""}
                            onChange={(e) =>
                              handleEditingChange("email", e.target.value)
                            }
                          />
                          <input
                            placeholder="Phone"
                            className="p-1"
                            value={editingItem.phone || ""}
                            onChange={(e) =>
                              handleEditingChange("phone", e.target.value)
                            }
                          />
                        </div>
                      )}
                      {activeTab === "invoices" && (
                        <div className="flex gap-2.5">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="p-1"
                            value={editingItem.amount || 0}
                            onChange={(e) =>
                              handleEditingChange(
                                "amount",
                                Number(e.target.value),
                              )
                            }
                          />
                          <input
                            type="date"
                            className="p-1"
                            value={editingItem.date || ""}
                            onChange={(e) =>
                              handleEditingChange("date", e.target.value)
                            }
                          />
                        </div>
                      )}
                      {activeTab === "information" && (
                        <input
                          placeholder="Description"
                          className="p-1 w-full"
                          value={editingItem.description || ""}
                          onChange={(e) =>
                            handleEditingChange("description", e.target.value)
                          }
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2.5 text-stone-500">
                      {activeTab === "customers" && (
                        <>
                          <span>{item.email}</span>
                          <span>•</span>
                          <span>{item.phone}</span>
                        </>
                      )}
                      {activeTab === "invoices" && (
                        <>
                          <span>
                            <span>$</span>
                            <span>{item.amount}</span>
                          </span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </>
                      )}
                      {activeTab === "information" && (
                        <span>{item.description}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  {editingItem?.id === item.id ? (
                    <div className="flex gap-2.5">
                      <button
                        className="px-2 py-1 bg-green-500 rounded cursor-pointer border-[none] text-[white]"
                        onClick={saveEdit}
                        onKeyDown={(e) => handleKeyDown(e, saveEdit)}
                      >
                        Save
                      </button>
                      <button
                        className="px-2 py-1 rounded cursor-pointer bg-stone-500 border-[none] text-[white]"
                        onClick={cancelEdit}
                        onKeyDown={(e) => handleKeyDown(e, cancelEdit)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2.5">
                      <button
                        className="px-2 py-1 bg-sky-500 rounded cursor-pointer border-[none] text-[white]"
                        aria-label={`Edit ${item.name || item.title || item.number}`}
                        onClick={() => startEdit(item)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => startEdit(item))
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 rounded cursor-pointer border-[none] text-[white]"
                        aria-label={`Delete ${item.name || item.title || item.number}`}
                        onClick={() => removeItem(item.id)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => removeItem(item.id))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

export default DataManagementDashboard;
