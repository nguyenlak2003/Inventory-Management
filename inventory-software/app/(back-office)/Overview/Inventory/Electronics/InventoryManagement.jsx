"use client";

import React, { useState, useRef } from "react";
import InventoryTable from "./InventoryTable";
import InventoryModal from "./InventoryModal";
import SidebarMenu from "../../SidebarMenu/SidebarMenu";
function InventoryManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bodyOverflowStyle, setBodyOverflowStyle] = useState("auto");
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      code: "ITM001",
      name: "Office Chair",
      quantity: 50,
      sellPrice: 299.99,
      buyPrice: 150.0,
      providers: ["Office Solutions Inc", "Furniture Plus"],
      billingNumber: "BN-2023-001",
      purchaseDate: "2023-12-01",
    },
    {
      id: 2,
      code: "ITM002",
      name: "Desk Lamp",
      quantity: 75,
      sellPrice: 45.99,
      buyPrice: 22.5,
      providers: ["Lightning Co", "Home Essentials"],
      billingNumber: "BN-2023-002",
      purchaseDate: "2023-12-05",
    },
  ]);

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
    function updateItem(updatedItem) {
        setInventory((prev) =>
            prev.map((item) =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
            )
        );
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
        inventory={inventory}
        onOpenDetails={openModal}
        onEditItem={editItem}
        onRemoveItem={removeItem}
              isModalOpen={isModalOpen}
        onUpdateItem={updateItem}
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
