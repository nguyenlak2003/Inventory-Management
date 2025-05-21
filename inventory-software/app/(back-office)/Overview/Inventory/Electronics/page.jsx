import React from "react";
import EditableRow from "./EditableRow";
import ActionButtons from "./ActionButtons";

function page({
  activeTab,
  data,
  editingItem,
  handleEditingChange,
  startEdit,
  saveEdit,
  cancelEdit,
  addNewItem,
  removeItem,
}) {
  const capitalizedTab = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <section className="p-5 rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <header className="flex justify-between mb-5">
        <h2 className="m-0">{capitalizedTab}</h2>
        <button
          className="px-4 py-2 bg-red-600 rounded cursor-pointer border-[none] text-[white]"
          onClick={addNewItem}
        >
          Add New
        </button>
      </header>
      <table
        role="grid"
        className="w-full border-collapse"
        aria-label={`${activeTab} table`}
      >
        <thead>
          <tr className="text-left border-b-2 border-solid border-b-zinc-100">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Details</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              className="border-b border-solid border-b-zinc-100"
              key={item.id}
            >
              <td className="p-3">{item.id}</td>
              <td className="p-3">
                {editingItem?.id === item.id ? (
                  <input
                    className="p-1 w-full"
                    value={editingItem.name || ""}
                    onChange={(e) =>
                      handleEditingChange("name", e.target.value)
                    }
                  />
                ) : (
                  <span>{item.name}</span>
                )}
              </td>
              <td className="p-3">
                <EditableRow
                  item={item}
                  editingItem={editingItem}
                  activeTab={activeTab}
                  handleEditingChange={handleEditingChange}
                />
              </td>
              <td className="p-3">
                <ActionButtons
                  item={item}
                  editingItem={editingItem}
                  startEdit={startEdit}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                  removeItem={removeItem}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default page;
