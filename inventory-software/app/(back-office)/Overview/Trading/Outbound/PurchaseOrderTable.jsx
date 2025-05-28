"use client";
import React, { useState } from "react";
import OrderTableHeader from "./OrderTableHeader";

function PurchaseOrderTable({ orders, onRemoveOrder, onShowDetails }) {
  const [sortColumn, setSortColumn] = useState("date");
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
      return (a.amount - b.amount) * modifier;
    }
    if (sortColumn === "date") {
      return (new Date(a.date) - new Date(b.date)) * modifier;
    }
    return aVal.localeCompare(bVal) * modifier;
  });

  return (
    <div className="overflow-auto rounded-lg bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <table
        role="grid"
        aria-label="Purchase Orders Table"
        className="w-full border-collapse min-w-[800px]"
      >
        <caption className="absolute left-[-9999px]">
          List of purchase orders showing supplier, order details, and actions
        </caption>
        <thead>
          <tr className="bg-red-600 text-white">
            <OrderTableHeader
              column="supplierID"
              label="Supplier ID"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
            />
            <OrderTableHeader
              column="orderID"
              label="Order ID"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
            />
            <OrderTableHeader
              column="date"
              label="Date"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
            />
            <OrderTableHeader
              column="employeeID"
              label="Employee ID"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
            />
            <th scope="col" role="columnheader" className="px-4 py-3 text-left">
              Notes
            </th>
            <OrderTableHeader
              column="amount"
              label="Amount"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={sortTable}
              align="right"
            />
            <th
              scope="col"
              role="columnheader"
              className="px-4 py-3 text-center"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr
              className="border-b border-solid border-b-zinc-100"
              key={order.orderID}
            >
              <td className="px-4 py-3">{order.supplierID}</td>
              <td className="px-4 py-3">{order.orderID}</td>
              <td className="px-4 py-3">{order.date}</td>
              <td className="px-4 py-3">{order.employeeID}</td>
              <td className="px-4 py-3">{order.notes}</td>
              <td className="px-4 py-3 text-right">
                <span>{parseInt(order.amount, 10)}</span>
              </td>
              <td className="px-4 py-3 text-center">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseOrderTable;
