"use client";

import React from "react";
import InventoryForm from "./EditItemModal"; // Import component form mới
import ActionButton from "./ActionButton";

function ItemDetails({ item }) {
  return (
    <>
      <div><strong>Item Code:</strong> <span>{item?.code}</span></div>
      <div><strong>Name:</strong> <span>{item?.name}</span></div>
      <div><strong>Quantity:</strong> <span>{item?.quantity}</span></div>
      <div><strong>Sell Price:</strong> $<span>{item?.sellPrice?.toFixed(2)}</span></div>
      <div><strong>Buy Price:</strong> $<span>{item?.buyPrice?.toFixed(2)}</span></div>
      <div><strong>Description:</strong> <span>{item?.description}</span></div>
      <div><strong>Unit:</strong> <span>{item?.unit}</span></div>
      <div><strong>Category:</strong> <span>{item?.category}</span></div>
      <div>
        <strong>Providers: </strong>
        <span>{Array.isArray(item?.providers) ? item.providers.join(", ") : item?.providers}</span>
      </div>
      <div><strong>Billing Number:</strong> <span> {item?.billingNumber}</span></div>
      <div><strong>Purchase Date:</strong> <span> {item?.purchaseDate}</span></div>
    </>
  );
}

function InventoryModal({
  isOpen,
  selectedItem,
  isEditing,
  isAddingNew, 
  onClose,
  onSave,
}) {
  if (!isOpen) return null;

  // Xác định tiêu đề cho modal
  let modalTitleText = "Item Details";
  if (isEditing) {
    modalTitleText = isAddingNew ? "Add New Item" : "Edit Item"; //
  } else if (selectedItem) {
    modalTitleText = `${selectedItem.name} Details`;
  }

  return (
    <div
      id="details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
    >
      <div className="relative p-6 md:p-8 rounded-lg bg-white max-w-lg w-[90%] max-sm:p-5 max-sm:w-[95%]">
        <button
          aria-label="Close details modal"
          className="absolute text-2xl text-red-700 bg-transparent cursor-pointer border-none right-4 top-4"
          onClick={onClose}
        >
          &times;
        </button>
        <h2
          id="modal-title"
          className="pb-2.5 mb-5 text-xl font-semibold text-red-700 border-b-2 border-solid border-b-red-700"
        >
          {modalTitleText}
        </h2>
        <div className="grid gap-4">
          {isEditing ? (
            <InventoryForm   // này là component trong EditItemModal.jsx
              itemToEdit={selectedItem}
              onSave={onSave} // Truyền thẳng hàm onSave (saveItem) xuống
              onCancel={onClose}
              isAddingNew={isAddingNew} // Truyền state isAddingNew
            />
          ) : (
            <ItemDetails item={selectedItem} />
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryModal;