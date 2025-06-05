"use client";

import React, { useState, useEffect } from "react";
import ActionButton from "./ActionButton"; 

function InventoryForm({ itemToEdit, onSave, onCancel, isAddingNew }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(itemToEdit || {
        code: "", 
        name: "", 
        quantity: 0, 
        sellPrice: 0, 
        buyPrice: 0,
        categoryID: "",
        providers: [], 
        billingNumber: "", 
        purchaseDate: new Date().toISOString().split("T")[0],
        description: "", 
        unit: "", 
        category: ""
    });
  }, [itemToEdit, isAddingNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: (name === "quantity" || name === "sellPrice" || name === "buyPrice")
                    ? Number(value) || 0 // Đảm bảo giá trị là số
                    : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isCodeDisabled = true; 

  return (
    <form onSubmit={handleSubmit}>
      {/* Input cho Item Code */}
      <div className="mb-3">
        <label htmlFor="item-code-modal" className="block mb-1 font-medium">Item Code:</label>
        <input
          id="item-code-modal"
          name="code"
          type="text"
          className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300 bg-gray-100"
          value={formData.code || ""}
          onChange={handleChange}
          readOnly={isCodeDisabled} // Không cho sửa mã khi đang edit
        />
      </div>

      {/* Input cho Name */}
      <div className="mb-3">
        <label htmlFor="item-name-modal" className="block mb-1 font-medium">Name:</label>
        <input id="item-name-modal" name="name" type="text" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.name || ""} onChange={handleChange} required />
      </div>

      {/* Input cho Quantity */}
      {!isAddingNew && (
        <div className="mb-3">
          <label htmlFor="item-quantity-modal" className="block mb-1 font-medium">Quantity:</label>
          <input id="item-quantity-modal" name="quantity" type="number" min="0" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.quantity || 0} onChange={handleChange} required />
        </div>
      )}

      {/* Input cho Sell Price và Buy Price */}
      <div className="flex gap-4 mb-3">
        <div className="w-1/2">
          <label htmlFor="sell-price-modal" className="block mb-1 font-medium">Sell Price:</label>
          <input id="sell-price-modal" name="sellPrice" type="number" step="any" min="0" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.sellPrice || ""} onChange={handleChange} required />
        </div>
        <div className="w-1/2">
          <label htmlFor="buy-price-modal" className="block mb-1 font-medium">Buy Price:</label>
          <input id="buy-price-modal" name="buyPrice" type="number" step="any" min="0" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.buyPrice || ""} onChange={handleChange} required />
        </div>
      </div>

      {/* Input cho Unit */}
      <div className="mb-3">
        <label htmlFor="item-unit-modal" className="block mb-1 font-medium">Unit:</label>
        <input id="item-unit-modal" name="unit" type="text" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.unit || ""} onChange={handleChange} />
      </div>

      {/* Input cho Description */}
      <div className="mb-3">
        <label htmlFor="item-description-modal" className="block mb-1 font-medium">Description:</label>
        <textarea id="item-description-modal" name="description" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.description || ""} onChange={handleChange} rows="2"></textarea>
      </div>
      
      {/* Nút Save và Cancel */}
      <div className="flex gap-2.5 mt-5">
        <ActionButton variant="primary" type="submit">
          {isAddingNew ? "Add Item" : "Save Changes"}
        </ActionButton>
        <ActionButton variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </ActionButton>
      </div>
    </form>
  );
}

export default InventoryForm;