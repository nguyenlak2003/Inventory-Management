import React, { useState } from "react";
import ActionButton from "./ActionButton";
import EditItemModal from "./EditItemModal";

function EmployeeTable({
  employees,
  onOpenDetails,
  onEditItem,
  onRemoveItem,
}) {

    if (!employees || employees.length === 0) {
        return <div className="p-10 text-base text-center text-zinc-600">Không có khách hàng nào để hiển thị.</div>;
    }

   return (
       <div className="overflow-auto rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
           <table
               role="table"
               aria-label="Employee Items"
               className="w-full border-separate border-spacing-0 max-sm:text-sm border border-gray-300"
           >
               <thead>
                   <tr className="bg-red-700 text-[white]">
                       <th scope="col" className="px-6 py-5 text-base font-semibold text-left">
                           Employee ID
                       </th>
                       <th scope="col" className="p-4 text-left">
                           Name
                       </th>
                       <th scope="col" className="p-4 text-left">
                           Date of Birth
                       </th>
                       <th scope="col" className="p-4 text-left">
                           Gender
                       </th>
                       <th scope="col" className="px-3 py-4 text-center">
                           Manage
                       </th>
                   </tr>
               </thead>
               <tbody>
                   {employees?.map((item) => (
                       <TableRow
                           key={item.code}
                            item={item}
                            onOpenDetails={onOpenDetails}
                            onEditItem={onEditItem}
                            onRemoveItem={onRemoveItem}
                       />
                   ))}
               </tbody>
           </table>
       </div>
   );
}

function TableRow({
    item,
    onOpenDetails,
    onEditItem,
    onRemoveItem,
}) {
   return (
       <tr className="border-b border-solid border-b-zinc-100 text-black">
           <td className="px-6 py-5 text-base border border-gray-300">{item.code}</td>
           <td className="p-4 border border-gray-300">{item.name}</td>
           <td className="p-4 border border-gray-300">{item.dob ? new Date(item.dob).toLocaleDateString("vi-VN") : ""}</td>
           <td className="p-4 border border-gray-300">{item.gender}</td>
           <td className="px-3 py-5 text-center border border-gray-300">
               <div className="flex gap-2.5 justify-center">
                   <ActionButton
                       variant="primary"
                       onClick={() => onOpenDetails(item)}
                       className="min-w-[100px]"
                   >
                       Details
                   </ActionButton>
                   <ActionButton variant="secondary" onClick={() => onEditItem(item)}>
                       Edit
                   </ActionButton>
                   <ActionButton variant="danger" onClick={() => onRemoveItem(item.code)}>
                       Remove
                   </ActionButton>
               </div>
           </td>
       </tr>
   );
}

export default EmployeeTable;
