"use client";

import React, { useState, useRef, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import InventoryModal from "./InventoryModal";
import { useRouter } from 'next/navigation';

function InventoryManagement() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bodyOverflowStyle, setBodyOverflowStyle] = useState("auto");
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  // State to store the inventory items from the database
  const [fetchedInventory, setFetchedInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const category = "Electronics";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if(!apiUrl) {
      console.error("API is not defined");
      setError("Không thấy API");
      setIsLoading(false);
      return;
    }

    const fetchInventoryData = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if(!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dữ liệu.");
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/inventory/${category}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if(!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
        }

        const data = await response.json();

        const mappedData = data.map(item => {

          let derivedId = item.ProductID;
          if (typeof item.ProductID === 'string' && item.ProductID.length >= 3) {
            derivedId = item.ProductID.slice(-3);
          } else if (typeof item.ProductID === 'string') {
            derivedId = item.ProductID; // Giữ nguyên nếu ngắn hơn 3 ký tự
          } else {
            derivedId = String(Date.now()); // Fallback nếu ProductID không phải string
          }

          return {
            id: derivedId,
            code: item.ProductID,
            name: item.ProductName,
            quantity: item.Quantity,
            sellPrice: item.SellingPrice,
            buyPrice: item.ImportPrice,
            description: item.Description,
            unit: item.UnitOfMeasure,
            providers: item.SupplierName,
          }
        });

        setFetchedInventory(mappedData);
      } catch (err) {
        console.error(`Lỗi khi fetch inventory cho category '${category}':`, err);
        setError(err.message || "Không thể tải dữ liệu inventory.");
        setFetchedInventory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, [category, apiUrl, router]);;

  function openModal(item) {
    setLastFocusedElement(document.activeElement);
    setSelectedItem(
      item || {
        id: inventory.length + 1,
        code: "",
        name: "",
        quantity: 0,
        sellPrice: 0,
        buyPrice: 0,
        providers: [],
        billingNumber: "",
        purchaseDate: new Date().toISOString().split("T")[0],
      },
    );
    setIsEditing(!item);
    setIsModalOpen(true);
    setBodyOverflowStyle("hidden");
    setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);
  }

  function editItem(item) {
    setIsEditing(true);
    openModal(item);
  }

  function removeItem(id) {
    if (confirm("Are you sure you want to remove this item?")) {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  }

  function saveItem(updatedItem) {
    if (updatedItem) {
      const itemIndex = inventory.findIndex(
        (item) => item.id === updatedItem.id,
      );
      if (itemIndex === -1) {
        setInventory([...inventory, updatedItem]);
      } else {
        setInventory(
          inventory.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        );
      }
    }
    closeModal();
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedItem(null);
    setBodyOverflowStyle("auto");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" && isModalOpen) {
      closeModal();
    }
  }

  return (
      <section className="p-5 mx-auto my-0 bg-stone-50 max-w-[1400px] max-sm:p-2.5">

      <header className="flex justify-between items-center mb-8">
        <h1 className="pb-2.5 text-3xl text-red-700 border-b-2 border-solid border-b-red-700">
          ELECTRONICS
        </h1>
        <button
          className="px-6 py-3 text-base bg-red-700 rounded cursor-pointer border-[none] text-[white]"
          onClick={() => openModal(null)}
        >
          Add New Item
        </button>
      </header>

      <InventoryTable
        inventory={fetchedInventory}
        onOpenDetails={openModal}
        onEditItem={editItem}
        onRemoveItem={removeItem}
        isModalOpen={isModalOpen}
      />

      {isModalOpen && (
        <InventoryModal
          isOpen={isModalOpen}
          selectedItem={selectedItem}
          isEditing={isEditing}
          bodyOverflowStyle={bodyOverflowStyle}
          closeButtonRef={closeButtonRef}
          modalRef={modalRef}
          onClose={closeModal}
          onSave={saveItem}
          onKeyDown={handleKeyDown}
        />
      )}
    </section>
  );
}

export default InventoryManagement;