"use client";
import React, { useState, useEffect } from "react";
import SaleOrderTable from "./SaleOrderTable";
import AddOrderModal from "./AddOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";

function SaleOrderManagement() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/outbound`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const text = await response.text();
                    console.error("API error:", text);
                    return setOrders([]);
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    console.error("API did not return an array:", data);
                    return setOrders([]);
                }
                const mapped = data.map(order => ({
                    orderID: order.OutboundOrderID,
                    customerName: order.CustomerID, // This will show the ID, not the name
                    employeeID: order.EmployeeID,
                    date: order.DispatchDate ? order.DispatchDate.split('T')[0] : "",
                    notes: order.Notes,
                    amount: order.TotalAmount
                }));
                setOrders(mapped);
            } catch (err) {
                console.error("Fetch error:", err);
                setOrders([]);
            }
        };
        fetchOrders();
    }, []);

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
    };

    return (
        <section className="p-5 max-sm:p-2.5">
            <header className="flex justify-between items-center mb-5">
                <h1 className="pb-2 text-2xl font-semibold text-red-700 border-solid border-b-[3px] border-b-red-700">
                    Sale Orders
                </h1>
                <button
                    className="px-5 py-2.5 text-sm font-medium bg-red-700 rounded cursor-pointer border-[none] text-white"
                    onClick={toggleAddModal}
                >
                    Add New Order
                </button>
            </header>

            <SaleOrderTable
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

export default SaleOrderManagement;