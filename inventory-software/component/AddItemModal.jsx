import React from "react";

function AddItemModal({
  currentCategory,
  newItem,
  setNewItem,
  addItem,
  setShowAddItemModal,
}) {
  const handleInputChange = (field, value) => {
    newItem[field] = value;
    setNewItem({ ...newItem });
  };

  return (
    <div
      role="dialog"
      aria-label="Add new inventory item"
      className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setShowAddItemModal(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setShowAddItemModal(false);
        }
      }}
    >
      <div className="p-8 w-full rounded-xl bg-[white] max-w-[500px]">
        <h2 className="mb-5 text-2xl text-zinc-900">
          <span>Add New </span>
          <span>
            {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
          </span>
          <span> Item</span>
        </h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addItem(currentCategory);
          }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="mb-1.5 text-zinc-600">
              Name *
            </label>
            <input
              className="p-2 w-full rounded-md border border-solid border-zinc-300"
              id="name"
              type="text"
              value={newItem.name}
              required
              onChange={(event) =>
                handleInputChange("name", event.target.value)
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sku" className="mb-1.5 text-zinc-600">
              SKU *
            </label>
            <input
              className="p-2 w-full rounded-md border border-solid border-zinc-300"
              id="sku"
              type="text"
              value={newItem.sku}
              required
              onChange={(event) => handleInputChange("sku", event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-1.5 text-zinc-600">
              Description
            </label>
            <textarea
              className="p-2 w-full rounded-md border border-solid border-zinc-300 min-h-[100px]"
              id="description"
              value={newItem.description}
              onChange={(event) =>
                handleInputChange("description", event.target.value)
              }
            />
          </div>
          <div className="mb-5">
            <label htmlFor="price" className="mb-1.5 text-zinc-600">
              Price *
            </label>
            <input
              className="p-2 w-full rounded-md border border-solid border-zinc-300"
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={newItem.price}
              required
              onChange={(event) =>
                handleInputChange("price", event.target.value)
              }
            />
          </div>
          <div className="flex gap-2.5 justify-end">
            <button
              className="px-4 py-2 text-red-600 rounded-md border border-red-600 border-solid transition-all cursor-pointer bg-[white] duration-[0.2s]"
              type="button"
              onClick={() => setShowAddItemModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md transition-opacity cursor-pointer bg-[linear-gradient(rgb(170,24,23),rgb(62,18,9))] border-[none] duration-[0.2s] text-[white]"
              type="submit"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
