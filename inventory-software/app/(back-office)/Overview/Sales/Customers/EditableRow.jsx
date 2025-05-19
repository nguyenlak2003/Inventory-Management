import React from "react";

function EditableRow({ item, editingItem, activeTab, handleEditingChange }) {
  if (editingItem?.id === item.id) {
    return (
      <>
        {activeTab === "customers" && (
          <div className="flex gap-2.5">
            <input
              placeholder="Email"
              className="p-1"
              value={editingItem.email || ""}
              onChange={(e) => handleEditingChange("email", e.target.value)}
            />
            <input
              placeholder="Phone"
              className="p-1"
              value={editingItem.phone || ""}
              onChange={(e) => handleEditingChange("phone", e.target.value)}
            />
          </div>
        )}
        {activeTab === "invoices" && (
          <div className="flex gap-2.5">
            <input
              type="number"
              placeholder="Amount"
              className="p-1"
              value={editingItem.amount || 0}
              onChange={(e) =>
                handleEditingChange("amount", Number(e.target.value))
              }
            />
            <input
              type="date"
              className="p-1"
              value={editingItem.date || ""}
              onChange={(e) => handleEditingChange("date", e.target.value)}
            />
          </div>
        )}
        {activeTab === "information" && (
          <input
            placeholder="Description"
            className="p-1 w-full"
            value={editingItem.description || ""}
            onChange={(e) => handleEditingChange("description", e.target.value)}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex gap-2.5 text-stone-500">
      {activeTab === "customers" && (
        <>
          <span>{item.email}</span>
          <span>•</span>
          <span>{item.phone}</span>
        </>
      )}
      {activeTab === "invoices" && (
        <>
          <span>
            <span>$</span>
            <span>{item.amount}</span>
          </span>
          <span>•</span>
          <span>{item.date}</span>
        </>
      )}
      {activeTab === "information" && <span>{item.description}</span>}
    </div>
  );
}

export default EditableRow;
