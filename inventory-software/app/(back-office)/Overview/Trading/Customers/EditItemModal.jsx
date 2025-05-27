"use client";

import React, { useState, useEffect } from "react";
import ActionButton from "./ActionButton"; 

function CustomerForm({ itemToEdit, onSave, onCancel, isAddingNew }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(itemToEdit || {
        code: "", 
        name: "", 
        phone: "",
        address: "",
        email: "",
    });
  }, [itemToEdit, isAddingNew]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  }; 

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
          readOnly // Không cho sửa mã khi đang edit
        />
      </div>

      {/* Input cho Name */}
      <div className="mb-3">
        <label htmlFor="customer-name-modal" className="block mb-1 font-medium">Name:</label>
        <input id="customer-name-modal" name="name" type="text" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.name || ""} onChange={handleChange} required />
      </div>

      {/* Input cho Phone */}
      <div className="mb-3">
        <label htmlFor="customer-phone-modal" className="block mb-1 font-medium">Phone Number:</label>
        <input id="customer-phone-modal" name="phone" type="tel" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.phone || ""} onChange={handleChange} required />
      </div>

      {/* Input cho Address */}
      <div className="mb-3">
        <label htmlFor="customer-address-modal" className="block mb-1 font-medium">Address:</label>
        <input id="customer-address-modal" name="address" type="text" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.address || ""} onChange={handleChange} required />
      </div>

      {/* Input cho Email */}
      <div className="mb-3">
        <label htmlFor="customer-email-modal" className="block mb-1 font-medium">Email:</label>
        <input id="customer-email-modal" name="email" type="email" className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300" value={formData.email || ""} onChange={handleChange} required />
      </div>
      
      {/* Nút Save và Cancel */}
      <div className="flex gap-2.5 mt-5">
        <ActionButton variant="primary" type="submit">
          {isAddingNew ? "Add customer" : "Save Changes"}
        </ActionButton>
        <ActionButton variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </ActionButton>
      </div>
    </form>
  );
}

export default CustomerForm;