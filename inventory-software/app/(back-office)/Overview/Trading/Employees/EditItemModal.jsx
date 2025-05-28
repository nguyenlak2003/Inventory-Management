
import React, { useState, useEffect, useRef } from "react";

function EditItemModal({ isOpen, item, onSave, onClose }) {
  const [form, setForm] = useState(item || {});
  const [page, setPage] = useState(1); // State to track the current page
  const firstInputRef = useRef(null);

  useEffect(() => {
      setForm(item || {});
      setPage(1); // Reset to the first page when modal opens
      if (isOpen && firstInputRef.current) {
          firstInputRef.current.focus();
      }
  }, [item, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
      const { name, value } = e.target;
      setForm((prev) => ({
          ...prev,
          [name]:
              name === "quantity"
                  ? Number(value)
                  : name === "sellPrice" || name === "buyPrice"
                      ? parseFloat(value)
                      : value,
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
              {page === 1 ? (
                  <>
                      <div className="mb-3">
                          <label className="block mb-1 font-medium">Employee ID</label>
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
                      <div className="flex justify-end gap-2 mt-6">
                          <button
                              type="button"
                              className="px-4 py-2 rounded bg-gray-200"
                              onClick={onClose}
                          >
                              Cancel
                          </button>
                          <button
                              type="button"
                              className="px-4 py-2 rounded bg-red-700 text-white"
                              onClick={() => setPage(2)} // Navigate to the second page
                          >
                              Next
                          </button>
                      </div>
                  </>
              ) : (
                  <>
                      <div className="mb-3">
                          <label className="block mb-1 font-medium">Date of birth</label>
                          <input
                              name="quantity"
                              type="number"
                              min="0"
                              value={form.quantity || 0}
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
                      <div className="mb-3">
                          <label className="block mb-1 font-medium">Username</label>
                          <input
                              name="username"
                              value={form.username || ""}
                              onChange={handleChange}
                              className="w-full border px-3 py-2 rounded"
                              required
                          />
                      </div>
                      <div className="mb-3">
                          <label className="block mb-1 font-medium">Password</label>
                          <input
                              name="password"
                              type="password"
                              value={form.password || ""}
                              onChange={handleChange}
                              className="w-full border px-3 py-2 rounded"
                              required
                          />
                      </div>
                      <div className="mb-3">
                          <label className="block mb-1 font-medium">Role</label>
                          <select
                              name="role"
                              value={form.role || ""}
                              onChange={handleChange}
                              className="w-full border px-3 py-2 rounded"
                              required
                          >
                              <option value="">Select Role</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                              <option value="manager">Manager</option>
                          </select>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                          <button
                              type="button"
                              className="px-4 py-2 rounded bg-gray-200"
                              onClick={() => setPage(1)} // Navigate back to the first page
                          >
                              Back
                          </button>
                          <button
                              type="submit"
                              className="px-4 py-2 rounded bg-red-700 text-white"
                          >
                              Save
                          </button>
                      </div>
                  </>
              )}
          </form>
      </div>
  );
}

export default EditItemModal;
