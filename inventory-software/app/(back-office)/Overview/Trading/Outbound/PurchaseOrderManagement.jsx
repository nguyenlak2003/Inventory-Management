"use client";
import React, { useState } from "react";
import PurchaseOrderTable from "./PurchaseOrderTable";
import AddOrderModal from "./AddOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";
function PurchaseOrderManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      supplierID: "SUP001",
      orderID: "ORD123",
      date: "2024-01-15",
      employeeID: "EMP456",
      notes: "Priority shipping required",
      amount: 1250.0,
    },
    {
      supplierID: "SUP002",
      orderID: "ORD124",
      date: "2024-01-16",
      employeeID: "EMP789",
      notes: "Bulk order discount applied",
      amount: 3450.0,
    },
  ]);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const addNewOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
    setShowAddModal(false);
  };

  const removeOrder = (orderID) => {
    setOrders(orders.filter((order) => order.orderID !== orderID));
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    // In a real application, this would likely open a details modal or navigate to a details page
  };

  return (
    <section className="p-5 max-sm:p-2.5">
      <header className="flex justify-between items-center mb-5">
        <h1 className="pb-2 text-2xl font-semibold text-red-600 border-solid border-b-[3px] border-b-red-600">
          Purchase Orders
        </h1>
        <button
          className="px-5 py-2.5 text-sm font-medium bg-red-600 rounded cursor-pointer border-[none] text-white"
          onClick={toggleAddModal}
        >
          Add New Order
        </button>
      </header>

      <PurchaseOrderTable
        orders={orders}
        onRemoveOrder={removeOrder}
        onShowDetails={showOrderDetails}
      />
          <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
          />
      {showAddModal && (
        <AddOrderModal onClose={toggleAddModal} onAddOrder={addNewOrder} />
      )}
    </section>
  );
}

export default PurchaseOrderManagement;
