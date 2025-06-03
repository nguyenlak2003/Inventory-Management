import React from "react";

function AuditLogTable({
  auditLogs,
  isLoading,
  error,
  selectedRow,
  onShowDetails,
  onTableKeyNav,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-solid border-zinc-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <table
        role="grid"
        aria-label="Audit log entries"
        className="w-full border-collapse"
        onKeyDown={(event) => onTableKeyNav(event)}
      >
        <thead>
          <tr className="bg-zinc-100">
            <th className="p-4 text-left">Timestamp</th>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Activity</th>
            <th className="p-4 text-left">IP Address</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="p-5 text-center">
                Loading audit logs...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="6" className="p-5 text-center text-red-700">
                {error}
              </td>
            </tr>
          ) : (
            auditLogs?.map((log, index) => (
              <tr
                className="hover:bg-zinc-50"
                role="row"
                key={log.id}
                tabIndex={selectedRow === index ? 0 : -1}
                aria-selected={selectedRow === index}
              >
                <td className="p-4">{log.timestamp}</td>
                <td className="p-4">{log.user}</td>
                <td className="p-4">{log.activity}</td>
                <td className="p-4">{log.ipAddress}</td>
                <td className="p-4">
                  <span
                    className="px-2 py-1 text-xs rounded text-[white]"
                    style={{
                      background:
                        log.status === "Failed"
                          ? "rgb(180, 0, 0)"
                          : "rgb(75, 175, 80)",
                    }}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    className="px-2 py-1 text-red-700 rounded border border-red-700 border-solid cursor-pointer hover:bg-red-50"
                    onClick={(event) => onShowDetails(log)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onShowDetails(log);
                      }
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLogTable;
