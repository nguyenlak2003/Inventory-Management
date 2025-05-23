
"use client";

import React from "react";
import ActionButton from "./ActionButton";

function InventoryModal({
isOpen,
selectedItem,
isEditing,
bodyOverflowStyle,
closeButtonRef,
modalRef,
onClose,
onSave,
onKeyDown,
}) {
const handleSave = () => {
  onSave(selectedItem);
};

return (
  <div
    id="details-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
    ref={modalRef}
    onKeyDown={onKeyDown}
    style={{
      overflow: bodyOverflowStyle,
    }}
  >
    <div className="relative p-8 rounded-lg bg-[white] max-w-[500px] w-[90%] max-sm:p-5 max-sm:w-[95%]">
      <button
        aria-label="Close details modal"
        className="absolute text-2xl text-red-700 bg-transparent cursor-pointer border-[none] right-[15px] top-[15px]"
        ref={closeButtonRef}
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
            {selectedItem?.id ? <span>Edit</span> : <span>Add New</span>}
            <span> Item</span>
          </span>
        ) : (
          <>
            <span>{selectedItem?.name}</span>
            <span> Details</span>
          </>
        )}
      </h2>
      <div className="grid gap-4">
        {isEditing ? (
          <EditForm
            selectedItem={selectedItem}
            onSave={handleSave}
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

function EditForm({ selectedItem, onSave, onCancel }) {
const handleCodeChange = (e) => {
  selectedItem.code = e.target.value;
};

const handleNameChange = (e) => {
  selectedItem.name = e.target.value;
};

const handleQuantityChange = (e) => {
  selectedItem.quantity = parseInt(e.target.value);
};

const handleSellPriceChange = (e) => {
  selectedItem.sellPrice = parseFloat(e.target.value);
};

const handleBuyPriceChange = (e) => {
  selectedItem.buyPrice = parseFloat(e.target.value);
};

return (
  <>
    <div>
      <label htmlFor="item-code">Customer ID:</label>
      <input
        id="item-code"
        type="text"
        className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
        defaultValue={selectedItem?.code}
        onChange={handleCodeChange}
      />
    </div>
    <div>
      <label htmlFor="item-name">Name:</label>
      <input
        id="item-name"
        type="text"
        className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
        defaultValue={selectedItem?.name}
        onChange={handleNameChange}
      />
    </div>
    <div>
      <label htmlFor="item-quantity">Phone number:</label>
      <input
        id="item-quantity"
        type="number"
        className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
        defaultValue={selectedItem?.quantity}
        onChange={handleQuantityChange}
      />
    </div>
    <div>
         <label htmlFor="address">Address:</label>
         <input
           id="address"
           type="text"
           className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
           defaultValue={selectedItem?.address}
           onChange={(e) => (selectedItem.address = e.target.value)}
         />
       </div>
       <div>
         <label htmlFor="email">Email:</label>
         <input
           id="email"
           type="email"
           className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
           defaultValue={selectedItem?.email}
           onChange={(e) => (selectedItem.email = e.target.value)}
         />
       </div>
    <div className="flex gap-2.5 mt-5">
      <ActionButton variant="primary" onClick={onSave}>
        Save
      </ActionButton>
      <ActionButton variant="secondary" onClick={onCancel}>
        Cancel
      </ActionButton>
    </div>
  </>
);
}

function ItemDetails({ selectedItem }) {
return (
  <>
  
     <div>
       <strong>Address:</strong>
       <span> {selectedItem?.address}</span>
     </div>
     <div>
       <strong>Email:</strong>
       <span> {selectedItem?.email}</span>
     </div>
   </>
);
}

export default InventoryModal;
