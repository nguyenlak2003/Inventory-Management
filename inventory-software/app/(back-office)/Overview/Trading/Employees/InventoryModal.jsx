
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
   const [currentPage, setCurrentPage] = useState(1);
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
               : name === "sellPrice" || name === "buyPrice"
               ? parseFloat(value)
               : value,
       }));
   };

   const handleSave = () => {
       onSave(form);
   };

   const handlePageChange = () => {
       setCurrentPage((prevPage) => (prevPage === 1 ? 2 : 1));
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
                           <span> Employee</span>
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
                       currentPage === 1 ? (
                           <EditFormPage1
                               form={form}
                               onChange={handleChange}
                               firstInputRef={firstInputRef}
                           />
                       ) : (
                           <EditFormPage2 form={form} onChange={handleChange} />
                       )
                   ) : (
                       <ItemDetails selectedItem={form} />
                   )}
               </div>
               {isEditing && (
                   <div className="flex justify-between mt-5">
                       <ActionButton variant="secondary" onClick={handlePageChange}>
                           {currentPage === 1 ? "Next" : "Back"}
                       </ActionButton>
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

function EditFormPage1({ form, onChange, firstInputRef }) {
   return (
       <>
           <div>
               <label htmlFor="item-code">Employee ID:</label>
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
           <div>
               <label htmlFor="gender">Gender:</label>
               <select
                   id="gender"
                   name="gender"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.gender || ""}
                   onChange={onChange}
               >
                   <option value="male">Male</option>
                   <option value="female">Female</option>
                   <option value="other">Other</option>
               </select>
           </div>
           <div>
               <label htmlFor="dob">Date of Birth:</label>
               <input
                   id="dob"
                   name="dob"
                   type="date"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.dob || ""}
                   onChange={onChange}
               />
           </div>
       </>
   );
}

function EditFormPage2({ form, onChange }) {
   return (
       <>
           <div>
               <label htmlFor="username">Username:</label>
               <input
                   id="username"
                   name="username"
                   type="text"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.username || ""}
                   onChange={onChange}
               />
           </div>
           <div>
               <label htmlFor="password">Password:</label>
               <input
                   id="password"
                   name="password"
                   type="password"
                   className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                   value={form.password || ""}
                   onChange={onChange}
               />
           </div>
           <div>
                         <label htmlFor="role">Role:</label>
                         <select
                             id="role"
                             name="role"
                             className="p-2 mt-1.5 w-full rounded border border-solid border-stone-300"
                             value={form.role || ""}
                             onChange={onChange}
                         >
                             <option value="admin">Admin</option>
                             <option value="user">User</option>
                         </select>
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
               <strong>Gender:</strong>
               <span> {selectedItem?.gender}</span>
           </div>
           <div>
               <strong>Date of Birth:</strong>
               <span> {selectedItem?.dob}</span>
           </div>
           <div>
                         <strong>Username:</strong>
                         <span> {selectedItem?.username}</span>
                     </div>
                     <div>
                         <strong>Password:</strong>
                         <span> {selectedItem?.password}</span>
                     </div>
                     <div>
                         <strong>Role:</strong>
                         <span> {selectedItem?.role}</span>
                     </div>
       </>
   );
}

export default InventoryModal;
