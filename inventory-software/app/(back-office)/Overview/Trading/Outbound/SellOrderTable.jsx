"use client";
import React, { useState } from "react";
import OrderTableHeader from "./OrderTableHeader";

function PurchaseOrderTable({ orders, onRemoveOrder, onShowDetails }) {
  const [sortColumn, setSortColumn] = useState("dispatchDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const sortTable = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort the orders based on current sort settings
  const sortedOrders = [...orders].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortColumn === "amount") {
      return (parseFloat(a.amount) - parseFloat(b.amount)) * modifier;
    }
    if (sortColumn === "dispatchDate") {
      return (new Date(a.dispatchDate) - new Date(b.dispatchDate)) * modifier;
    }
    return aVal && bVal ? aVal.localeCompare(bVal) * modifier : 0;
  });

  // Add border classes for column separation
  const thClass = "px-4 py-3 text-left border-r border-zinc-200 last:border-r-0";
  const tdClass = "px-4 py-3 border-r border-zinc-100 last:border-r-0";
  const tdRightClass = "px-4 py-3 text-right border-r border-zinc-100 last:border-r-0";
  const tdCenterClass = "px-4 py-3 text-center border-r border-zinc-100 last:border-r-0";

  const hasRows = sortedOrders.length > 1 || (sortedOrders.length === 1 && sortedOrders[0] !== undefined);

  return (
    <div className="overflow-auto rounded-lg bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <table
        role="grid"
        aria-label="Purchase Orders Table"
        className="w-full border-collapse min-w-[800px]"
      >
        <caption className="absolute left-[-9999px]">
          List of purchase orders showing buyer, order details, and actions
        </caption>
        <thead>
          <tr className="bg-red-600 text-white">
            <OrderTableHeader
              column="orderID"
              label="Order ID"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
              className={thClass}
            />
            <OrderTableHeader
              column="buyerName"
              label="Buyer Name"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
              className={thClass}
            />
            <OrderTableHeader
              column="dispatchDate"
              label="Dispatch Date"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
              className={thClass}
            />
            <th scope="col" role="columnheader" className={thClass}>
              Notes
            </th>
            <OrderTableHeader
              column="amount"
              label="Amount"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
              align="right"
              className={thClass}
            />
            <th
              scope="col"
              role="columnheader"
              className="px-4 py-3 text-center border-r-0"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.length === 0 || sortedOrders.filter((_, idx) => idx !== 0).length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                Chưa có đơn bán nào, hãy thêm đơn bán
              </td>
            </tr>
          ) : (
            sortedOrders.map((order, idx) =>
              idx === 0 ? null : (
                <tr
                  className="border-b border-solid border-b-zinc-100"
                  key={order.orderID}
                >
                  <td className={tdClass}>{order.orderID}</td>
                  <td className={tdClass}>{order.buyerName}</td>
                  <td className={tdClass}>{order.dispatchDate}</td>
                  <td className={tdClass}>{order.notes}</td>
                  <td className={tdRightClass}>
                    <span>
                      ${parseFloat(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className={tdCenterClass}>
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-4 py-2 text-sm bg-red-600 rounded cursor-pointer border-[none] text-white"
                        aria-label={`View details for order ${order.orderID}`}
                        onClick={() => onShowDetails(order)}
                      >
                        Order Details
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-red-600 bg-white rounded border border-red-600 border-solid cursor-pointer"
                        aria-label={`Remove order ${order.orderID}`}
                        onClick={() => onRemoveOrder(order.orderID)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseOrderTable;
