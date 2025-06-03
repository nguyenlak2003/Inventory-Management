"use client";
import React, { useState, useEffect } from "react";

const FIELDS_PER_PAGE = 10;

function AddOrderModal({ onClose, onAddOrder }) {
    const [step, setStep] = useState(1);
    const [newOrder, setNewOrder] = useState({
        orderID: "",
        customerName: "",
        date: "",
        notes: "",
        numberOfItems: 0,
    });
    const [orderItems, setOrderItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerID, setSelectedCustomerID] = useState("");

    // Removed UUID generation on mount

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/api/customers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch customers');
                return res.json();
            })
            .then(data => setCustomers(data))
            .catch(err => {
                setCustomers([]);
                console.error('Failed to fetch customers:', err);
            });
    }, []);

    const totalPages = Math.ceil(Number(newOrder.numberOfItems) / FIELDS_PER_PAGE) || 1;

    useEffect(() => {
        const amt = Number(newOrder.numberOfItems);
        if (amt > 0) {
            setOrderItems((prev) => {
                const items = prev.slice(0, amt);
                while (items.length < amt) {
                    items.push({
                        productID: "",
                        warehouseID: "",
                        quantityDispatched: "",
                        unitPrice: "",
                    });
                }
                return items;
            });
        } else {
            setOrderItems([]);
        }
    }, [newOrder.numberOfItems]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewOrder({
            ...newOrder,
            [id]: id === "numberOfItems" ? Number(value) : value,
        });
        if (id === "numberOfItems" && Number(value) < step - 1) {
            setStep(1);
        }
    };

    const handleCustomerChange = (e) => {
        setSelectedCustomerID(e.target.value);
        setNewOrder(prev => ({
            ...prev,
            customerName: e.target.value
        }));
    };

    const handleItemChange = (idx, field, value) => {
        setOrderItems((prev) => {
            const updated = [...prev];
            updated[idx][field] = value;
            return updated;
        });
    };

    const handleSubmit = async () => {
        let dateValue = newOrder.date;
        if (dateValue) {
            dateValue = new Date(dateValue).toISOString();
        }

        const payload = {
            CustomerID: newOrder.customerName,
            DispatchDate: dateValue,
            TotalAmount: orderItems.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantityDispatched || 0), 0),
            Notes: newOrder.notes,
            Items: orderItems.map(item => ({
                ProductID: item.productID,
                WarehouseID: item.warehouseID,
                QuantityDispatched: Number(item.quantityDispatched),
                UnitPrice: Number(item.unitPrice),
                LineTotal: Number(item.unitPrice || 0) * Number(item.quantityDispatched || 0)
            }))
        };

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            // Create outbound order (do not send OutboundOrderID)
            const orderRes = await fetch(`${apiUrl}/api/outbound`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    CustomerID: payload.CustomerID,
                    DispatchDate: payload.DispatchDate,
                    TotalAmount: payload.TotalAmount,
                    Notes: payload.Notes
                })
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                alert(errorData.message || "Failed to add order");
                return;
            }

            // Get the generated OutboundOrderID from the response
            const orderData = await orderRes.json();
            const OutboundOrderID = orderData.OutboundOrderID;

            // Add outbound order details
            const detailsRes = await fetch(`${apiUrl}/api/outbound-details`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    OutboundOrderID,
                    Items: payload.Items
                })
            });

            if (!detailsRes.ok) {
                const errorData = await detailsRes.json();
                alert(errorData.message || "Failed to add order details");
                return;
            }

            onAddOrder({
                ...newOrder,
                orderID: OutboundOrderID,
                amount: payload.TotalAmount,
            });
            onClose();
        } catch (err) {
            alert("Error adding order: " + err.message);
        }
    };

    const handleEscapeKey = (event) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    if (step === 1) {
        return (
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
            >
                <div className="p-6 rounded-lg bg-white max-w-[500px] w-[90%]">
                    <h2 id="modal-title" className="mb-5 text-red-700">
                        Add New Order
                    </h2>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-col gap-1">
                            <label htmlFor="orderID">Order ID</label>
                            <input
                                id="orderID"
                                className="p-2 rounded border border-solid border-zinc-300 bg-zinc-100 text-zinc-400 cursor-not-allowed select-none"
                                value="(Auto-generated)"
                                disabled
                                tabIndex={-1}
                                readOnly
                                aria-readonly="true"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="customerName">Customer</label>
                            <select
                                id="customerName"
                                className="p-2 rounded border border-solid border-zinc-300"
                                value={selectedCustomerID}
                                onChange={handleCustomerChange}
                                required
                            >
                                <option value="">-- Select Customer --</option>
                                {customers.map(customer => (
                                    <option key={customer.CustomerID} value={customer.CustomerID}>
                                        {customer.CustomerID} - {customer.CustomerName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="date">Date</label>
                            <input
                                id="date"
                                type="date"
                                className="p-2 rounded border border-solid border-zinc-300"
                                value={newOrder.date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                className="p-2 rounded border border-solid border-zinc-300 min-h-[100px]"
                                value={newOrder.notes}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="numberOfItems">Number of Items</label>
                            <input
                                id="numberOfItems"
                                type="number"
                                min={1}
                                className="p-2 rounded border border-solid border-zinc-300"
                                value={newOrder.numberOfItems}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-red-700 rounded border border-red-700 border-solid cursor-pointer bg-white"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-700 rounded cursor-pointer border-[none] text-white"
                                onClick={() => setStep(2)}
                                disabled={Number(newOrder.numberOfItems) < 1}
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const startIdx = (step - 2) * FIELDS_PER_PAGE;
    const endIdx = Math.min(startIdx + FIELDS_PER_PAGE, Number(newOrder.numberOfItems));
    const currentItems = orderItems.slice(startIdx, endIdx);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
        >
            <div className="p-6 rounded-lg bg-white max-w-[700px] w-[95%]">
                <h2 id="modal-title" className="mb-5 text-red-700">
                    Add Order Items ({step - 1}/{totalPages})
                </h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <table className="w-full border border-zinc-300 mb-4">
                        <thead>
                            <tr className="bg-zinc-100">
                                <th className="p-2 border">#</th>
                                <th className="p-2 border">Product ID</th>
                                <th className="p-2 border">Warehouse ID</th>
                                <th className="p-2 border">Quantity Dispatched</th>
                                <th className="p-2 border">Unit Price</th>
                                <th className="p-2 border">Line Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, idx) => {
                                const quantity = Number(item.quantityDispatched) || 0;
                                const price = Number(item.unitPrice) || 0;
                                const lineTotal = quantity * price;
                                return (
                                    <tr key={startIdx + idx}>
                                        <td className="p-2 border text-center">{startIdx + idx + 1}</td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={item.productID}
                                                onChange={(e) =>
                                                    handleItemChange(startIdx + idx, "productID", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={item.warehouseID}
                                                onChange={(e) =>
                                                    handleItemChange(startIdx + idx, "warehouseID", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                type="number"
                                                min={0}
                                                value={item.quantityDispatched}
                                                onChange={(e) =>
                                                    handleItemChange(startIdx + idx, "quantityDispatched", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                type="number"
                                                min={0}
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleItemChange(startIdx + idx, "unitPrice", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="p-2 border text-right">
                                            {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="flex gap-2 justify-between mt-4">
                        <div>
                            <button
                                type="button"
                                className="px-4 py-2 text-red-700 rounded border border-red-700 border-solid cursor-pointer bg-white"
                                onClick={step === 2 ? onClose : () => setStep(step - 1)}
                            >
                                {step === 2 ? "Cancel" : "Back"}
                            </button>
                        </div>
                        <div>
                            {step - 1 < totalPages ? (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-red-700 rounded cursor-pointer border-[none] text-white"
                                    onClick={() => setStep(step + 1)}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-red-700 rounded cursor-pointer border-[none] text-white"
                                    onClick={handleSubmit}
                                >
                                    Add Order
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddOrderModal;