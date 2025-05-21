"use client";
import React, { useState } from "react";

function AddItemModal({ category, onClose, onAdd }) {
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newItem);
  };

  return (
    <div
      role="dialog"
      aria-label="Add new inventory item"
      className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      <div className="p-8 w-full rounded-xl bg-white max-w-[500px]">
        <h2 className="mb-5 text-2xl text-zinc-900">
          <span>Add New </span>
          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
          <span> Item</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1.5 text-zinc-600">
              Name *
            </label>
            <input
              className="p-2 w-full rounded-md border border-solid border-zinc-300"
              id="name"
              type="text"
              value={newItem.name}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sku" className="block mb-1.5 text-zinc-600">
              Item code *
            </label>
            <input
              className="p-2 w-full rounded-md border border-solid border-zinc-300"
              id="sku"
              type="text"
              value={newItem.sku}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1.5 text-zinc-600">
              Description
            </label>
            <textarea
              className="p-2 w-full rounded-md border border-solid border-zinc-300 min-h-[100px]"
              id="description"
              value={newItem.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="price" className="block mb-1.5 text-zinc-600">
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
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2.5 justify-end">
            <button
              className="px-4 py-2 text-red-600 rounded-md border border-red-600 border-solid transition-all cursor-pointer bg-white duration-[0.2s] hover:bg-red-50"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md transition-opacity cursor-pointer bg-gradient-to-b from-red-600 to-red-800 border-none duration-[0.2s] text-white hover:opacity-90"
              type="submit"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
