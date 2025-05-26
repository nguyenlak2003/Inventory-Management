"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import SupplierTable from "./SupplierTable";
import SupplierModal from "./SupplierModal";
import ActionButton from "./ActionButton";

function SupplierManagement() {
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const closeButtonRef = useRef(null);
  
  const [fetchedSupppliers, setFetchedSuppliers] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSuppliersData = async () => {
      const token = localStorage.getItem("token");

      if (!token) { 
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dữ liệu.");
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/suppliers`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
        }

        const data = await response.json();

        const mappedData = data.map(item => ({
          code: item.SupplierID,
          name: item.SupplierName,
          phone: item.PhoneNumber,
          address: item.Addr,
          email: item.Email,
        }));

        setFetchedSuppliers(mappedData);

      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    }

    fetchSuppliersData();
  }, [apiUrl, router]);


  const openDetailsModal = (item) => {
    setLastFocusedElement(document.activeElement);
    setSelectedItem(item); 
    setIsEditing(false);   
    setIsAddingNew(false);
    setIsModalOpen(true);
    setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);
  };

  const openEditModal = (item) => {
    setLastFocusedElement(document.activeElement);
    setSelectedItem(item); 
    setIsEditing(true);    
    setIsAddingNew(false);
    setIsModalOpen(true);
    setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);
  }

  const removeItem = (supplierID) => {
    if(confirm("Are you sure you want to remove this item?")) {
      const token = localStorage.getItem('token');
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
    setIsEditing(false);
    setIsAddingNew(false);
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
          PROVIDER
        </h1>
        <button
          className="px-6 py-3 text-base bg-red-700 rounded cursor-pointer border-[none] text-[white]"
          onClick={() => openModal(null)}
        >
          Add New Item
        </button>
      </header>

      <SupplierTable
        supppliers={fetchedSupppliers}
        onOpenDetails={openDetailsModal}
        onEditItem={openEditModal}
        onRemoveItem={removeItem}
      />

      {isModalOpen && (
        <SupplierModal
          isOpen={isModalOpen}
          selectedItem={selectedItem}
          isAddingNew={isAddingNew}
          isEditing={isEditing}
          onClose={closeModal}
          onSave={saveItem} 
        />
      )}
    </section>
  );
}

export default SupplierManagement;
