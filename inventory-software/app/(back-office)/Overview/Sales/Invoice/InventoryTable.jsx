"use client";
import React, { useState } from "react";

function InventoryTable({
  data,
  columns,
  title,
  searchQuery,
  onSearch,
  onAddNew,
}) {
  const [focusedCell, setFocusedCell] = useState({
    row: -1,
    col: -1,
  });

  const handleTableKeyNav = (event, rowIndex, colIndex, numRows, numCols) => {
    event.preventDefault();
    switch (event.key) {
      case "ArrowDown":
        if (rowIndex < numRows - 1) {
          setFocusedCell({
            row: rowIndex + 1,
            col: colIndex,
          });
        }
        break;
      case "ArrowUp":
        if (rowIndex > 0) {
          setFocusedCell({
            row: rowIndex - 1,
            col: colIndex,
          });
        }
        break;
      case "ArrowRight":
        if (colIndex < numCols - 1) {
          setFocusedCell({
            row: rowIndex,
            col: colIndex + 1,
          });
        }
        break;
      case "ArrowLeft":
        if (colIndex > 0) {
          setFocusedCell({
            row: rowIndex,
            col: colIndex - 1,
          });
        }
        break;
    }
  };

  return (
    <section className="p-8 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-4 items-center">
          <label htmlFor="table-search" className="text-base text-zinc-600">
            Search:
          </label>
          <input
            className="px-3 py-2 text-sm rounded border border-solid border-zinc-300"
            id="table-search"
            type="search"
            placeholder="Search..."
            aria-label={`Search ${title}`}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          className="px-5 py-2.5 text-base bg-red-600 rounded cursor-pointer border-none duration-[0.2s] text-white transition-[background-color] hover:bg-red-700"
          onClick={onAddNew}
        >
          <span>Add New </span>
          <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="p-10 text-base text-center text-zinc-600">
          <span>No </span>
          <span>{title}</span>
          <span> found. Add some using the button above.</span>
        </div>
      ) : (
        <div className="overflow-x-auto max-sm:max-w-[100vw]">
          <table
            role="grid"
            className="w-full text-left border-collapse"
            aria-label={`${title} table`}
          >
            <thead>
              <tr className="bg-red-600 text-white">
                {columns.map((column) => (
                  <th
                    scope="col"
                    className="px-4 py-3 text-sm font-semibold tracking-wide uppercase"
                    key={column}
                  >
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm font-semibold tracking-wide uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr
                  className="border-b border-solid border-b-zinc-100"
                  role="row"
                  key={item.id || rowIndex}
                  tabIndex={focusedCell.row === rowIndex ? 0 : -1}
                  onKeyDown={(event) => {
                    handleTableKeyNav(
                      event,
                      rowIndex,
                      focusedCell.col,
                      data.length,
                      columns.length + 1,
                    );
                  }}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "white" : "#f9f9f9",
                  }}
                >
                  {Object.values(item)
                    .slice(1)
                    .map((value, colIndex) => (
                      <td
                        role="gridcell"
                        className="px-4 py-3 text-sm text-zinc-600"
                        key={colIndex}
                        tabIndex={
                          focusedCell.row === rowIndex &&
                          focusedCell.col === colIndex
                            ? 0
                            : -1
                        }
                      >
                        {value}
                      </td>
                    ))}
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 text-sm text-red-600 bg-transparent rounded border border-red-600 border-solid transition-all cursor-pointer duration-[0.2s] hover:bg-red-50"
                      aria-label={`Remove ${Object.values(item)[1]}`}
                      onClick={(e) => {
                        e.preventDefault();
                        // This would call a remove function passed as prop
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          // This would call a remove function passed as prop
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
      )}
    </section>
  );
}

export default InventoryTable;
