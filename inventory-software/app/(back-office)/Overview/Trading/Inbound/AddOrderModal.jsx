"use client";
import React, { useState, useEffect } from "react";

function AddOrderModal({ onClose, onAddOrder }) {
  const [newOrder, setNewOrder] = useState({
    supplierID: "",
    orderID: "",
    date: "",
    employeeID: "",
    notes: "",
    amount: 0,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewOrder({
      ...newOrder,
      [id]: id === "amount" ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    onAddOrder(newOrder);
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  // Add event listener for escape key
  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

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
              onClick={handleSubmit}
            >
              Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrderModal;
