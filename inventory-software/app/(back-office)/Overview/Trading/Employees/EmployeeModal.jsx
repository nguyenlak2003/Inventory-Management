"use client";

import React, { useState, useEffect, useRef } from "react";
import EmployeeForm from "./EditItemModal";

function EmployeeModal({
    isOpen,
    selectedItem,
    isEditing,
    isAddingNew,
    onClose,
    onSave,
    onKeyDown,
    onUsernameCheck
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
                           {!isAddingNew ? <span>Edit Employee</span> : <span>Add New Employee</span>}
                       </span>
                   ) : (
                       <>
                          <span>{selectedItem?.name} Details</span>
                       </>
                   )}
               </h2>

               <div className="grid gap-4">
                   {isEditing ? (
                        <EmployeeForm // Sử dụng component thực tế để sửa/thêm
                            isOpen={isOpen} // Truyền isOpen nếu EditItemModalComponent cần cho logic render của nó
                            itemToEdit={selectedItem}
                            onSave={onSave} // onSave này từ EmployeeManagement
                            onCancel={onClose} // Cho nút Cancel nội bộ của EditItemModalComponent
                            isAddingNew={isAddingNew} // Để EditItemModal biết là đang thêm mới hay không
                            onUsernameCheck={onUsernameCheck}
                        />
                    ) : (
                        <ItemDetails selectedItem={selectedItem} /> // Đổi tên cho rõ ràng
                    )}
               </div>

               {!isEditing && (
                   <div className="flex justify-end mt-5">
                       <button
                           type="button"
                           className="px-4 py-2 rounded bg-gray-200"
                           onClick={onClose}
                       >
                           Đóng
                       </button>
                   </div>
               )}
           </div>
       </div>
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
               <span> {selectedItem.dob ? new Date(selectedItem.dob).toLocaleDateString("vi-VN") : ""}</span>
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

export default EmployeeModal;
