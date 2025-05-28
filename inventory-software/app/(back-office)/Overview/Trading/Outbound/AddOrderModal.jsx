"use client";
import React, { useState, useEffect } from "react";

const FIELDS_PER_PAGE = 10;

function AddOrderModal({ onClose, onAddOrder }) {
  const [step, setStep] = useState(1);
  const [newOrder, setNewOrder] = useState({
    supplierID: "",
    orderID: "",
    date: "",
    employeeID: "",
    notes: "",
    amount: 0,
  });
  const [orderItems, setOrderItems] = useState([]);

  // Calculate number of pages based on amount
  const totalPages = Math.ceil(Number(newOrder.amount) / FIELDS_PER_PAGE) || 1;

  // Initialize orderItems array when amount changes
  useEffect(() => {
    const amt = Number(newOrder.amount);
    if (amt > 0) {
      setOrderItems((prev) => {
        const items = prev.slice(0, amt);
        while (items.length < amt) {
          items.push({
            productID: "",
            warehouseID: "",
            name: "",
            unitPrice: "",
            category: "",
          });
        }
        return items;
      });
    } else {
      setOrderItems([]);
    }
  }, [newOrder.amount]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewOrder({
      ...newOrder,
      [id]: id === "amount" ? Number(value) : value,
    });
    if (id === "amount" && Number(value) < step - 1) {
      setStep(1);
    }
  };

  const handleItemChange = (idx, field, value) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handleSubmit = () => {
    onAddOrder({
      ...newOrder,
      items: orderItems,
    });
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Render first page (order info)
  if (step === 1) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
      >
        <div className="p-6 rounded-lg bg-white max-w-[500px] w-[90%]">
          <h2 id="modal-title" className="mb-5 text-red-600">
            Add New Order
          </h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="supplierID">Supplier ID</label>
              <input
                id="supplierID"
                className="p-2 rounded border border-solid border-zinc-300"
                value={newOrder.supplierID}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="orderID">Order ID</label>
              <input
                id="orderID"
                className="p-2 rounded border border-solid border-zinc-300"
                value={newOrder.orderID}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                className="p-2 rounded border border-solid border-zinc-300"
                value={newOrder.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="employeeID">Employee ID</label>
              <input
                id="employeeID"
                className="p-2 rounded border border-solid border-zinc-300"
                value={newOrder.employeeID}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                className="p-2 rounded border border-solid border-zinc-300 min-h-[100px]"
                value={newOrder.notes}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                min={1}
                className="p-2 rounded border border-solid border-zinc-300"
                value={newOrder.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 text-red-600 rounded border border-red-600 border-solid cursor-pointer bg-white"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 rounded cursor-pointer border-[none] text-white"
                onClick={() => setStep(2)}
                disabled={Number(newOrder.amount) < 1}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render item entry pages
  const startIdx = (step - 2) * FIELDS_PER_PAGE;
  const endIdx = Math.min(startIdx + FIELDS_PER_PAGE, Number(newOrder.amount));
  const currentItems = orderItems.slice(startIdx, endIdx);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
    >
      <div className="p-6 rounded-lg bg-white max-w-[700px] w-[95%]">
        <h2 id="modal-title" className="mb-5 text-red-600">
          Add Order Items ({step - 1}/{totalPages})
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <table className="w-full border border-zinc-300 mb-4">
            <thead>
              <tr className="bg-zinc-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product ID</th>
                <th className="p-2 border">Warehouse ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Category</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={startIdx + idx}>
                  <td className="p-2 border text-center">{startIdx + idx + 1}</td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={item.productID}
                      onChange={(e) =>
                        handleItemChange(startIdx + idx, "productID", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={item.warehouseID}
                      onChange={(e) =>
                        handleItemChange(startIdx + idx, "warehouseID", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(startIdx + idx, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(startIdx + idx, "unitPrice", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded"
                      value={item.category}
                      onChange={(e) =>
                        handleItemChange(startIdx + idx, "category", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 justify-between mt-4">
            <div>
              <button
                type="button"
                className="px-4 py-2 text-red-600 rounded border border-red-600 border-solid cursor-pointer bg-white"
                onClick={step === 2 ? onClose : () => setStep(step - 1)}
              >
                {step === 2 ? "Cancel" : "Back"}
              </button>
            </div>
            <div>
              {step - 1 < totalPages ? (
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 rounded cursor-pointer border-[none] text-white"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 rounded cursor-pointer border-[none] text-white"
                  onClick={handleSubmit}
                >
                  Add Order
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrderModal;
