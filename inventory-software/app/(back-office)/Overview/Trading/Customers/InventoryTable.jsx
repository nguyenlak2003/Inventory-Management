import React, { useState } from "react";
import ActionButton from "./ActionButton";
import EditItemModal from "./EditItemModal";

function InventoryTable({
  inventory,
  onOpenDetails,
  onRemoveItem,
  isModalOpen,
  onUpdateItem, // new prop for updating
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  function handleEdit(item) {
      setEditItem(item);
      setEditModalOpen(true);
  }

  function handleSave(updatedItem) {
      onUpdateItem(updatedItem);
      setEditModalOpen(false);
      setEditItem(null);
  }

  function handleClose() {
      setEditModalOpen(false);
      setEditItem(null);
  }

  return (
      <div className="overflow-auto rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          <table
              role="table"
              aria-label="Inventory Items"
              className="w-full border-separate border-spacing-0 max-sm:text-sm border border-gray-300"
          >
              <thead>
                  <tr className="bg-red-700 text-[white]">
                      <th scope="col" className="px-6 py-5 text-base font-semibold text-left">
                          Customer ID
                      </th>
                      <th scope="col" className="p-4 text-left">
                          Name
                      </th>
                      <th scope="col" className="px-3 py-4 text-center">
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
                          onEditItem={handleEdit}
                          onRemoveItem={onRemoveItem}
                          isModalOpen={isModalOpen}
                      />
                  ))}
              </tbody>
          </table>
          <EditItemModal
              isOpen={editModalOpen}
              item={editItem}
              onSave={handleSave}
              onClose={handleClose}
          />
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
      <tr className="border-b border-solid border-b-zinc-100 text-black">
          <td className="px-6 py-5 text-base border border-gray-300">{item.code}</td>
          <td className="p-4 border border-gray-300">{item.name}</td>
          <td className="px-3 py-5 text-center border border-gray-300">
              <div className="flex gap-2.5 justify-center">
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
