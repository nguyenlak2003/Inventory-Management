
"use client";

import React from "react";
import SupplierForm from "./EditItemModal"
import ActionButton from "./ActionButton";

function SupplierModal({
  isOpen,
  selectedItem,
  isEditing,
  isAddingNew,
  onClose,
  onSave,
  onKeyDown,
}) {

  if (!isOpen) return null;

return (
  <div
    id="details-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
    onKeyDown={onKeyDown}
  >
    <div className="relative p-8 rounded-lg bg-[white] max-w-[500px] w-[90%] max-sm:p-5 max-sm:w-[95%]">
      <button
        aria-label="Close details modal"
        className="absolute text-2xl text-red-700 bg-transparent cursor-pointer border-[none] right-[15px] top-[15px]"
        onClick={onClose}
      >
        ×
      </button>
      <h2
        id="modal-title"
        className="pb-2.5 mb-5 text-red-700 border-b-2 border-solid border-b-red-700"
      >
        {isEditing ? (
          <span>
            {!isAddingNew ? <span>Edit Supplier</span> : <span>Add New Supplier</span>}
          </span>
        ) : (
          <>
            <span>{selectedItem?.name} Details</span>
          </>
        )}
      </h2>
      <div className="grid gap-4">
        {isEditing ? (
          <SupplierForm
            itemToEdit={selectedItem}
            isAddingNew={isAddingNew}
            onSave={onSave}
            onCancel={onClose}
          />
        ) : (
          <ItemDetails selectedItem={selectedItem} />
        )}
      </div>
    </div>
  </div>
);
}

function ItemDetails({ selectedItem }) {
  return (
    <>
      <div><strong>Provider ID:</strong> <span>{selectedItem?.code}</span></div>
      <div><strong>Name:</strong> <span>{selectedItem?.name}</span></div>
      <div><strong>Phone Number:</strong> <span>{selectedItem?.phone}</span></div>
      <div><strong>Address:</strong> <span>{selectedItem?.address}</span></div>
      <div><strong>Email:</strong> <span>{selectedItem?.email}</span></div>
    </>
  );
}

export default SupplierModal;
