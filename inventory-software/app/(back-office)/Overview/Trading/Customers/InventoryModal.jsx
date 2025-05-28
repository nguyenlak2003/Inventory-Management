
"use client";

import React, { useState, useEffect, useRef } from "react";
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
   const [form, setForm] = useState(selectedItem || {});
   const firstInputRef = useRef(null);

   useEffect(() => {
       setForm(selectedItem || {});
       if (isOpen && firstInputRef.current) {
           firstInputRef.current.focus();
       }
   }, [selectedItem, isOpen]);

   if (!isOpen) return null;

   const handleChange = (e) => {
       const { name, value } = e.target;
       setForm((prev) => ({
           ...prev,
           [name]: name === "quantity"
               ? Number(value)
               : value,
       }));
   };

   const handleSave = () => {
       onSave(form);
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
                           {form?.id ? <span>Edit</span> : <span>Add New</span>}
                           <span> Customer</span>
                       </span>
                   ) : (
                       <>
                           <span>{form?.name}</span>
                           <span> Details</span>
                       </>
                   )}
               </h2>
               <div className="grid gap-4">
                   {isEditing ? (
                       <EditForm form={form} onChange={handleChange} firstInputRef={firstInputRef} />
                   ) : (
                       <ItemDetails selectedItem={form} />
                   )}
               </div>
               {isEditing && (
                   <div className="flex justify-end mt-5">
                       <div className="flex gap-2.5">
                           <ActionButton variant="primary" onClick={handleSave}>
                               Save
                           </ActionButton>
                           <ActionButton variant="secondary" onClick={onClose}>
                               Cancel
                           </ActionButton>
                       </div>
                   </div>
               )}
           </div>
       </div>
   );
}

function EditForm({ form, onChange, firstInputRef }) {
   return (
       <>
           <div>
               <label htmlFor="item-code">Customer ID:</label>
               <input
                   id="item-code"
                   name="code"
                   type="text"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.code || ""}
                   onChange={onChange}
                   ref={firstInputRef}
               />
           </div>
           <div>
               <label htmlFor="item-name">Name:</label>
               <input
                   id="item-name"
                   name="name"
                   type="text"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.name || ""}
                   onChange={onChange}
               />
           </div>
           <div>
               <label htmlFor="item-quantity">Phone number:</label>
               <input
                   id="item-quantity"
                   name="quantity"
                   type="number"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.quantity || ""}
                   onChange={onChange}
               />
           </div>
           <div>
               <label htmlFor="address">Address:</label>
               <input
                   id="address"
                   name="address"
                   type="text"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.address || ""}
                   onChange={onChange}
               />
           </div>
           <div>
               <label htmlFor="email">Email:</label>
               <input
                   id="email"
                   name="email"
                   type="email"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.email || ""}
                   onChange={onChange}
               />
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
           <div>
               <strong>Phone number:</strong>
               <span> {selectedItem?.quantity}</span>
           </div>
       </>
   );
}

export default InventoryModal;
