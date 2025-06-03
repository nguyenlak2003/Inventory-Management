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
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        // Fetch customers
        fetch(`${apiUrl}/api/customers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setCustomers(data))
            .catch(() => setCustomers([]));
        // Fetch products
        fetch(`${apiUrl}/api/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setProducts(data))
            .catch(() => setProducts([]));
        // Fetch warehouses
        fetch(`${apiUrl}/api/warehouses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setWarehouses(data))
            .catch(() => setWarehouses([]));
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
        setErrors({});
    };

    const handleCustomerChange = (e) => {
        setSelectedCustomerID(e.target.value);
        setNewOrder(prev => ({
            ...prev,
            customerName: e.target.value
        }));
        setErrors({});
    };

    const handleItemChange = (idx, field, value) => {
        setOrderItems((prev) => {
            const updated = [...prev];
            updated[idx][field] = value;
            return updated;
        });
        setErrors({});
    };

    // Validation helpers
    const isValidDate = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return !isNaN(d.getTime());
    };

    const isValidProduct = (productID) => {
        return products.some(p => p.ProductID === productID);
    };

    const isValidWarehouse = (warehouseID) => {
        return warehouses.some(w => w.WarehouseID === warehouseID);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!isValidDate(newOrder.date)) {
            newErrors.date = "Please enter a valid date.";
        }
        if (!newOrder.numberOfItems || Number(newOrder.numberOfItems) <= 0) {
            newErrors.numberOfItems = "Number of items must be greater than 0.";
        }
        orderItems.forEach((item, idx) => {
            if (!isValidProduct(item.productID)) {
                newErrors[`productID_${idx}`] = "Invalid Product ID.";
            }
            if (!isValidWarehouse(item.warehouseID)) {
                newErrors[`warehouseID_${idx}`] = "Invalid Warehouse ID.";
            }
            if (!item.quantityDispatched || Number(item.quantityDispatched) <= 0) {
                newErrors[`quantityDispatched_${idx}`] = "Quantity must be greater than 0.";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFirstPage = () => {
        const newErrors = {};
        if (!newOrder.orderID || newOrder.orderID.trim() === "") {
            newErrors.orderID = "Order ID is required.";
        }
        if (!newOrder.customerName || newOrder.customerName.trim() === "") {
            newErrors.customerName = "Customer is required.";
        }
        if (!isValidDate(newOrder.date)) {
            newErrors.date = "Please enter a valid date.";
        }
        if (!newOrder.numberOfItems || Number(newOrder.numberOfItems) <= 0) {
            newErrors.numberOfItems = "Number of items must be greater than 0.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

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

            const orderRes = await fetch(`${apiUrl}/api/outbound`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    OutboundOrderID: newOrder.orderID,
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

            const orderData = await orderRes.json();
            const OutboundOrderID = orderData.OutboundOrderID;

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
        const handleNext = () => {
            if (validateFirstPage()) {
                setStep(2);
            }
        };

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
                                className="p-2 rounded border border-solid border-zinc-300"
                                value={newOrder.orderID}
                                onChange={handleInputChange}
                                placeholder="Enter Order ID"
                                autoComplete="off"
                            />
                            {errors.orderID && <span className="text-red-600 text-sm">{errors.orderID}</span>}
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
                            {errors.customerName && <span className="text-red-600 text-sm">{errors.customerName}</span>}
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
                            {errors.date && <span className="text-red-600 text-sm">{errors.date}</span>}
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
                            {errors.numberOfItems && <span className="text-red-600 text-sm">{errors.numberOfItems}</span>}
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
                                onClick={handleNext}
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
                                const globalIdx = startIdx + idx;
                                const quantity = Number(item.quantityDispatched) || 0;
                                const price = Number(item.unitPrice) || 0;
                                const lineTotal = quantity * price;
                                return (
                                    <tr key={globalIdx}>
                                        <td className="p-2 border text-center">{globalIdx + 1}</td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={item.productID}
                                                onChange={(e) =>
                                                    handleItemChange(globalIdx, "productID", e.target.value)
                                                }
                                            />
                                            {errors[`productID_${globalIdx}`] && (
                                                <span className="text-red-600 text-xs">{errors[`productID_${globalIdx}`]}</span>
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={item.warehouseID}
                                                onChange={(e) =>
                                                    handleItemChange(globalIdx, "warehouseID", e.target.value)
                                                }
                                            />
                                            {errors[`warehouseID_${globalIdx}`] && (
                                                <span className="text-red-600 text-xs">{errors[`warehouseID_${globalIdx}`]}</span>
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                type="number"
                                                min={0}
                                                value={item.quantityDispatched}
                                                onChange={(e) =>
                                                    handleItemChange(globalIdx, "quantityDispatched", e.target.value)
                                                }
                                            />
                                            {errors[`quantityDispatched_${globalIdx}`] && (
                                                <span className="text-red-600 text-xs">{errors[`quantityDispatched_${globalIdx}`]}</span>
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="w-full p-1 border rounded"
                                                type="number"
                                                min={0}
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleItemChange(globalIdx, "unitPrice", e.target.value)
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