import React from "react";

function OrderTableHeader({
  column,
  label,
  currentSort,
  direction,
  onSort,
  align = "left",
}) {
  const isActive = currentSort === column;
  const alignmentClass = align === "right" ? "text-right" : "text-left";

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSort(column);
    }
  };

  return (
    <th
      className={`px-4 py-3 ${alignmentClass} cursor-pointer`}
      scope="col"
      role="columnheader"
      tabIndex={0}
      aria-sort={isActive ? direction : "none"}
      onClick={() => onSort(column)}
      onKeyDown={handleKeyDown}
    >
      <span>{label} </span>
      {isActive && <span>{direction === "asc" ? "↑" : "↓"}</span>}
    </th>
  );
}

export default OrderTableHeader;
