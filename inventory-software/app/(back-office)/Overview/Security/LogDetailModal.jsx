import React from "react";

function LogDetailModal({ isOpen, logEntry, onClose }) {
  if (!isOpen || !logEntry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-zinc-900">Log Details</h2>
          <button
            className="text-zinc-500 hover:text-zinc-700 text-2xl"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <div className="space-y-3">
          <div>
            <strong className="text-zinc-700">Timestamp:</strong>
            <p className="text-zinc-600">{logEntry.timestamp}</p>
          </div>
          <div>
            <strong className="text-zinc-700">User:</strong>
            <p className="text-zinc-600">{logEntry.user}</p>
          </div>
          <div>
            <strong className="text-zinc-700">Activity:</strong>
            <p className="text-zinc-600">{logEntry.activity}</p>
          </div>
          <div>
            <strong className="text-zinc-700">IP Address:</strong>
            <p className="text-zinc-600">{logEntry.ipAddress}</p>
          </div>
          <div>
            <strong className="text-zinc-700">Status:</strong>
            <p className="text-zinc-600">{logEntry.status}</p>
          </div>
          {logEntry.details && (
            <div>
              <strong className="text-zinc-700">Additional Details:</strong>
              <p className="text-zinc-600">{logEntry.details}</p>
            </div>
          )}
        </div>
        <footer className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

export default LogDetailModal;
