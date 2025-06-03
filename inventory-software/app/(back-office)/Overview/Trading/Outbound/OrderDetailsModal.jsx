import React, { useState, useEffect } from "react";

const PAGE_SIZE = 10;

function OrderDetailsModal({ order, onClose }) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!order) {
            setItems([]);
            setPage(1);
            setError(null);
            return;
        }

        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/outbound-details/${order.orderID}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch order details");
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError("Failed to load order details.");
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [order]);

    if (!order) return null;

    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    const pagedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-[1000]"
        >
            <div className="p-6 rounded-lg bg-white max-w-[700px] w-[95%]">
                <h2 id="modal-title" className="mb-5 text-red-700">
                    Order Details
                </h2>
                <div className="flex flex-col gap-2">
                    <div><span className="font-semibold">Order ID:</span> {order.orderID}</div>
                    <div><span className="font-semibold">CustomerID:</span> {order.customerName}</div>
                    <div><span className="font-semibold">Dispatch Date:</span> {order.date}</div>
                    <div><span className="font-semibold">Notes:</span> {order.notes}</div>
                    <div><span className="font-semibold">Amount:</span> ${parseFloat(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                {loading && <div className="mt-4 text-center text-gray-500">Loading order items...</div>}
                {error && <div className="mt-4 text-center text-red-700">{error}</div>}
                {!loading && !error && items.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-red-700 mb-2">Order Items</h3>
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
                                {pagedItems.map((item, idx) => (
                                    <tr key={item.OutboundDetailID || idx + (page - 1) * PAGE_SIZE}>
                                        <td className="p-2 border text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                        <td className="p-2 border">{item.ProductID}</td>
                                        <td className="p-2 border">{item.WarehouseID}</td>
                                        <td className="p-2 border">{item.QuantityDispatched}</td>
                                        <td className="p-2 border">{item.UnitPrice}</td>
                                        <td className="p-2 border">{item.LineTotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mb-2">
                                <button
                                    className="px-3 py-1 border border-zinc-300 rounded disabled:opacity-50"
                                    onClick={handlePrev}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="px-3 py-1 border border-zinc-300 rounded disabled:opacity-50"
                                    onClick={handleNext}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 text-red-700 rounded border border-red-700 border-solid cursor-pointer bg-white"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsModal;