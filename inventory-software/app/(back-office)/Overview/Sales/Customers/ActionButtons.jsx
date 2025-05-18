import React from "react";

function ActionButtons({
  item,
  editingItem,
  startEdit,
  saveEdit,
  cancelEdit,
  removeItem,
}) {
  const handleKeyDown = (e, action) => {
    if (e.key === "Escape") {
      action();
    }
  };

  if (editingItem?.id === item.id) {
    return (
      <div className="flex gap-2.5">
        <button
          className="px-2 py-1 bg-green-500 rounded cursor-pointer border-[none] text-[white]"
          onClick={saveEdit}
          onKeyDown={(e) => handleKeyDown(e, saveEdit)}
        >
          Save
        </button>
        <button
          className="px-2 py-1 rounded cursor-pointer bg-stone-500 border-[none] text-[white]"
          onClick={cancelEdit}
          onKeyDown={(e) => handleKeyDown(e, cancelEdit)}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <button
        className="px-2 py-1 bg-sky-500 rounded cursor-pointer border-[none] text-[white]"
        aria-label={`Edit ${item.name}`}
        onClick={() => startEdit(item)}
        onKeyDown={(e) => handleKeyDown(e, () => startEdit(item))}
      >
        Edit
      </button>
      <button
        className="px-2 py-1 bg-red-500 rounded cursor-pointer border-[none] text-[white]"
        aria-label={`Delete ${item.name}`}
        onClick={() => removeItem(item.id)}
        onKeyDown={(e) => handleKeyDown(e, () => removeItem(item.id))}
      >
        Delete
      </button>
    </div>
  );
}

export default ActionButtons;
