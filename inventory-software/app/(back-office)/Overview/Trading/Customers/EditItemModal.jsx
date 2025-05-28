
import React, { useState, useEffect, useRef } from "react";

function EditItemModal({ isOpen, item, onSave, onClose }) {
 const [form, setForm] = useState(item || {});
 const firstInputRef = useRef(null);

 useEffect(() => {
   setForm(item || {});
   if (isOpen && firstInputRef.current) {
     firstInputRef.current.focus();
   }
 }, [item, isOpen]);

 if (!isOpen) return null;

 function handleChange(e) {
   const { name, value } = e.target;
   setForm((prev) => ({
     ...prev,
     [name]: name === "quantity" ? Number(value) : value,
   }));
 }

 function handleSubmit(e) {
   e.preventDefault();
   onSave(form);
 }

 return (
   <div
     className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
     role="dialog"
     aria-modal="true"
   >
     <form
       className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[95vw]"
       onSubmit={handleSubmit}
     >
       <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
       <div className="mb-3">
         <label className="block mb-1 font-medium">Customer ID</label>
         <input
           ref={firstInputRef}
           name="code"
           value={form.code || ""}
           onChange={handleChange}
           className="w-full border px-3 py-2 rounded"
           required
         />
       </div>
       <div className="mb-3">
         <label className="block mb-1 font-medium">Name</label>
         <input
           name="name"
           value={form.name || ""}
           onChange={handleChange}
           className="w-full border px-3 py-2 rounded"
           required
         />
       </div>
       <div className="mb-3">
         <label className="block mb-1 font-medium">Phone number</label>
         <input
           name="sellPrice"
           type="number"
           min="0"
           step="0.01"
           value={form.sellPrice || 0}
           onChange={handleChange}
           className="w-full border px-3 py-2 rounded"
           required
         />
       </div>
       <div className="mb-3">
         <label className="block mb-1 font-medium">Address</label>
         <input
           name="buyPrice"
           type="number"
           min="0"
           step="0.01"
           value={form.buyPrice || 0}
           onChange={handleChange}
           className="w-full border px-3 py-2 rounded"
           required
         />
       </div>
       <div className="flex justify-end gap-2 mt-6">
         <button
           type="button"
           className="px-4 py-2 rounded bg-gray-200"
           onClick={onClose}
         >
           Cancel
         </button>
         <button
           type="submit"
           className="px-4 py-2 rounded bg-red-700 text-white"
         >
           Save
         </button>
       </div>
     </form>
   </div>
 );
}

export default EditItemModal;
