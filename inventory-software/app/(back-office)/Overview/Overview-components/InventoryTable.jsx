import React from "react";

function InventoryTable({
  activeTab,
  inventoryItems,
  openAddItemModal,
  removeItem,
}) {
  return (
    <div
      role="region"
      className="p-8 mt-5 rounded-xl bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      aria-label={`${activeTab} inventory`}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl text-zinc-900">
          <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          <span> Inventory</span>
        </h2>
        <button
          className="px-5 py-2.5 text-base rounded-md transition-opacity cursor-pointer bg-[linear-gradient(rgb(170,24,23),rgb(62,18,9))] border-[none] duration-[0.2s] text-zinc-100"
          onClick={() => openAddItemModal(activeTab)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openAddItemModal(activeTab);
            }
          }}
        >
          Add Item
        </button>
      </div>
      <table className="mt-5 w-full border-collapse">
        <thead>
          <tr className="bg-red-600 bg-opacity-10 text-zinc-900">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">SKU</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-right">Price</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item, index) => (
            <tr
              className="border-b border-solid border-b-zinc-100"
              key={item.sku || index}
            >
              <td className="p-4">{item.name}</td>
              <td className="p-4">{item.sku}</td>
              <td className="p-4">{item.description}</td>
              <td className="p-4 text-right">
                <span>$</span>
                <span>{item.price}</span>
              </td>
              <td className="p-4 text-center">
                <button
                  className="px-2.5 py-1.5 text-red-600 bg-transparent rounded border border-red-600 border-solid transition-all cursor-pointer duration-[0.2s]"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => {
                    removeItem(index);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      removeItem(index);
                    }
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
