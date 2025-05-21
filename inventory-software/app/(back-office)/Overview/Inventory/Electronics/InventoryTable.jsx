import React from "react";
import ActionButton from "./ActionButton";

function InventoryTable({
  inventory,
  onOpenDetails,
  onEditItem,
  onRemoveItem,
  isModalOpen,
}) {
  return (
    <div className="overflow-auto rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <table
        role="table"
        aria-label="Inventory Items"
        className="w-full border-separate border-spacing-0 max-sm:text-sm"
      >
        <thead>
          <tr className="bg-red-700 text-[white]">
            <th
              scope="col"
              className="px-6 py-5 text-base font-semibold text-left"
            >
              Item Code
            </th>
            <th scope="col" className="p-4 text-left">
              Name
            </th>
            <th scope="col" className="p-4 text-left">
              Quantity
            </th>
            <th scope="col" className="px-5 py-4 text-center">
              Manage
            </th>
          </tr>
        </thead>
        <tbody>
          {inventory?.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              onOpenDetails={onOpenDetails}
              onEditItem={onEditItem}
              onRemoveItem={onRemoveItem}
              isModalOpen={isModalOpen}
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
  isModalOpen,
}) {
  return (
    <tr className="border-b border-solid border-b-zinc-100">
      <td className="px-6 py-5 text-base">{item.code}</td>
      <td className="p-4">{item.name}</td>
      <td className="p-4">{item.quantity}</td>
      <td className="px-6 py-5 text-center">
        <div className="flex gap-2.5 justify-end">
          <ActionButton
            variant="primary"
            onClick={() => onOpenDetails(item)}
            aria-controls="details-modal"
            aria-expanded={isModalOpen}
            className="min-w-[100px]"
          >
            Details
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onEditItem(item)}>
            Edit
          </ActionButton>
          <ActionButton variant="danger" onClick={() => onRemoveItem(item.id)}>
            Remove
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}

export default InventoryTable;
