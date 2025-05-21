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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastActiveElement, setLastActiveElement] = useState(null);
  const [isAnnual, setIsAnnual] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(null);

  function setActiveTab(tab) {
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

    const index = getActiveData().findIndex(
      (item) => item.id === editingItem.id,
    );
    if (index !== -1) {
      switch (activeTab) {
        case "customers":
          const updatedCustomers = [...customers];
          updatedCustomers[index] = editingItem;
          setCustomers(updatedCustomers);
          break;
        case "invoices":
          const updatedInvoices = [...invoices];
          updatedInvoices[index] = editingItem;
          setInvoices(updatedInvoices);
          break;
        case "information":
          const updatedInformation = [...information];
          updatedInformation[index] = editingItem;
          setInformation(updatedInformation);
          break;
      }
      setEditingItem(null);
    }
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  function addNewItem(type) {
    const newItem = {
      id: Date.now(),
    };

    switch (type) {
      case "customers":
        setCustomers([
          ...customers,
          {
            ...newItem,
            name: "",
            email: "",
            phone: "",
          },
        ]);
        break;
      case "invoices":
        setInvoices([
          ...invoices,
          {
            ...newItem,
            number: "",
            amount: "",
            date: "",
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
          },
        ]);
        break;
    }
  }

  function removeItem(type, id) {
    switch (type) {
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

  function getActiveData() {
    switch (activeTab) {
      case "customers":
        return customers;
      case "invoices":
        return invoices;
      case "information":
        return information;
      default:
        return [];
    }
  }

  function toggleBilling() {
    setIsAnnual(!isAnnual);
  }

  function validateEmail() {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword() {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  }

  function toggleLoginModal() {
    if (!showLoginModal) {
      setLastActiveElement(document.activeElement);
      setShowLoginModal(true);
      // Reset form state
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
    } else {
      setShowLoginModal(false);
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    }
  }

  function handleOutsideClick(e) {
    if (e.target === e.currentTarget) {
      toggleLoginModal();
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (email === "admin" && password === "admin") {
        toggleLoginModal();
      } else {
        setPasswordError("Invalid email or password");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-5">
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
            onChange={(event) => handleSearch(event)}
          />
          <span className="absolute left-2.5 top-2/4 -translate-y-2/4 text-stone-500">
            🔍
          </span>
        </div>
        <div className="flex gap-2.5">
          <button
            className="px-5 py-2.5 rounded cursor-pointer border-[none]"
            onClick={(event) => setActiveTab("customers")}
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
            onClick={(event) => setActiveTab("invoices")}
            style={{
              backgroundColor: activeTab === "invoices" ? "#E31B23" : "#f5f5f5",
              color: activeTab === "invoices" ? "white" : "black",
            }}
          >
            Invoices
          </button>
          <button
            className="px-5 py-2.5 rounded cursor-pointer border-[none]"
            onClick={(event) => setActiveTab("information")}
            style={{
              backgroundColor:
                activeTab === "information" ? "#E31B23" : "#f5f5f5",
              color: activeTab === "information" ? "white" : "black",
            }}
          >
            Information
          </button>
        </div>
      </div>
      <div className="p-5 rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between mb-5">
          <h2 className="m-0">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button
            className="px-4 py-2 bg-red-600 rounded cursor-pointer border-[none] text-[white]"
            onClick={(event) => addNewItem(activeTab)}
          >
            Add New
          </button>
        </div>
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
            {getFilteredData()?.map((item) => (
              <tr
                className="border-b border-solid border-b-zinc-100"
                key={item.id}
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">
                  <>
                    {editingItem?.id === item.id ? (
                      <input
                        className="p-1 w-full"
                        value={editingItem.name || editingItem.title || ""}
                        onChange={(event) =>
                          handleEditingChange(
                            activeTab === "information" ? "title" : "name",
                            event.target.value,
                          )
                        }
                      />
                    ) : null}
                    {!(editingItem?.id === item.id) ? (
                      <span>{item.name || item.title || item.number}</span>
                    ) : null}
                  </>
                </td>
                <td className="p-3">
                  <>
                    {editingItem?.id === item.id ? (
                      <>
                        {activeTab === "customers" ? (
                          <div className="flex gap-2.5">
                            <input
                              placeholder="Email"
                              className="p-1"
                              value={editingItem.email || ""}
                              onChange={(event) =>
                                handleEditingChange("email", event.target.value)
                              }
                            />
                            <input
                              placeholder="Phone"
                              className="p-1"
                              value={editingItem.phone || ""}
                              onChange={(event) =>
                                handleEditingChange("phone", event.target.value)
                              }
                            />
                          </div>
                        ) : null}
                        {activeTab === "invoices" ? (
                          <div className="flex gap-2.5">
                            <input
                              type="number"
                              placeholder="Amount"
                              className="p-1"
                              value={editingItem.amount || 0}
                              onChange={(event) =>
                                handleEditingChange(
                                  "amount",
                                  Number(event.target.value),
                                )
                              }
                            />
                            <input
                              type="date"
                              className="p-1"
                              value={editingItem.date || ""}
                              onChange={(event) =>
                                handleEditingChange("date", event.target.value)
                              }
                            />
                          </div>
                        ) : null}
                        {activeTab === "information" ? (
                          <input
                            placeholder="Description"
                            className="p-1 w-full"
                            value={editingItem.description || ""}
                            onChange={(event) =>
                              handleEditingChange(
                                "description",
                                event.target.value,
                              )
                            }
                          />
                        ) : null}
                      </>
                    ) : null}
                    {!(editingItem?.id === item.id) ? (
                      <div className="flex gap-2.5 text-stone-500">
                        {activeTab === "customers" ? (
                          <>
                            <span>{item.email}</span>
                            <span>•</span>
                            <span>{item.phone}</span>
                          </>
                        ) : null}
                        {activeTab === "invoices" ? (
                          <>
                            <span>
                              <span>$</span>
                              <span>{item.amount}</span>
                            </span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </>
                        ) : null}
                        {activeTab === "information" ? (
                          <span>{item.description}</span>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                </td>
                <td className="p-3">
                  <>
                    {editingItem?.id === item.id ? (
                      <div className="flex gap-2.5">
                        <button
                          className="px-2 py-1 bg-green-500 rounded cursor-pointer border-[none] text-[white]"
                          onClick={(event) => saveEdit()}
                          onKeyDown={(event) =>
                            handleKeyDown(event, () => saveEdit())
                          }
                        >
                          Save
                        </button>
                        <button
                          className="px-2 py-1 rounded cursor-pointer bg-stone-500 border-[none] text-[white]"
                          onClick={(event) => cancelEdit()}
                          onKeyDown={(event) =>
                            handleKeyDown(event, () => cancelEdit())
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                    {!(editingItem?.id === item.id) ? (
                      <div className="flex gap-2.5">
                        <button
                          className="px-2 py-1 bg-sky-500 rounded cursor-pointer border-[none] text-[white]"
                          aria-label={`Edit ${item.name || item.title || item.number}`}
                          onClick={(event) => startEdit(item)}
                          onKeyDown={(event) =>
                            handleKeyDown(event, () => startEdit(item))
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 rounded cursor-pointer border-[none] text-[white]"
                          aria-label={`Delete ${item.name || item.title || item.number}`}
                          onClick={(event) => removeItem(activeTab, item.id)}
                          onKeyDown={(event) =>
                            handleKeyDown(event, () =>
                              removeItem(activeTab, item.id),
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function handleEditingChange(field, value) {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      [field]: value,
    });
  }
}

export default DataManagementDashboard;
