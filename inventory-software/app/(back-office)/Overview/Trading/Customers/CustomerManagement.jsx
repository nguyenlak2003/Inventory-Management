"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";

function CustomerManagement() {
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const closeButtonRef = useRef(null);
  
  const [fetchedCustomers, setFetchedCustomers] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCustomersData = async () => {
      const token = localStorage.getItem("token");

      if (!token) { 
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dữ liệu.");
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/customers`, {
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
          code: item.CustomerID,
          name: item.CustomerName,
          phone: item.PhoneNumber,
          address: item.Addr,
          email: item.Email,
        }));

        setFetchedCustomers(mappedData);

      } catch (err) {
        console.error("Error fetching Customer:", err);
      }
    }

    fetchCustomersData();
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

  const openAddNewModal = async () => {

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${apiUrl}/api/customers/next-code/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy mã khách hàng mới từ server.');
        }

        const data = await response.json();
        setLastFocusedElement(document.activeElement);

        setSelectedItem({
            code: data.nextCode, 
            name: "",
            phone: "",
            address: "",
            email: "",
        });

        setIsEditing(true);
        setIsAddingNew(true);
        setIsModalOpen(true);

    } catch (error) {
        console.error("Lỗi khi mở form thêm mới:", error);
        alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }

  };

  const removeItem = async (customerID) => {
    if(confirm("Are you sure you want to remove this item?")) {
      const token = localStorage.getItem('token');

      if(!token) {
        setError("Bạn chưa đăng nhập hoặc lỗi cấu hình");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/customers/${customerID}/deActive`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

      if (!response.ok) {
        let errorData = { message: `Lỗi HTTP: ${response.status}. Không thể đọc chi tiết lỗi từ server.` };
        try {
            errorData = await response.json();
        } catch (e) {
            console.error("Không thể parse JSON lỗi từ server:", e);
        }

        if (response.status === 403) {
          console.log("Lỗi 403 từ server:", errorData.message);
          setError("Chỉ admin mới có quyền thực hiện thao tác này."); 
        } else {
          setError(errorData.message || `Lỗi HTTP: ${response.status}`);
        }
        return; 
      }
        setFetchedCustomers(prevCustomers =>
        prevCustomers.filter((item) => item.code !== customerID));   

      } catch (err) {
        
      }
    }
  }

  const saveItem = async (itemDataFromForm) => {
    const token = localStorage.getItem('token');

    if(!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
      setIsLoading(false);
      router.replace("/");  
      return false;
    }

    // Email validation: must match SQL LIKE '%_@__%.__%'
    const email = itemDataFromForm.email;
    const emailRegex = /^[^@]+@[^@]{2,}\.[^@]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ. Vui lòng nhập đúng định dạng email.');
      return false;
    }

    // Phone validation: only digits, length 10 or 11
    const phone = itemDataFromForm.phone;
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại không hợp lệ. Chỉ nhập số, độ dài 10 hoặc 11 chữ số.');
      return false;
    }

    const customerID = itemDataFromForm.code;

    const payload = {
      CustomerID: itemDataFromForm.code,
      CustomerName: itemDataFromForm.name,
      PhoneNumber: itemDataFromForm.phone,
      Addr: itemDataFromForm.address,
      Email: itemDataFromForm.email,
    };

    const method = isAddingNew ? "POST" : "PUT";
    const endpoint = isAddingNew 
      ? `${apiUrl}/api/customers` 
      : `${apiUrl}/api/customers/${customerID}`;

    try {

      const response = await fetch(endpoint, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
      }

      if (isAddingNew) {
        setFetchedCustomers(prev => [...prev, itemDataFromForm]);
      } else { // Editing
        setFetchedCustomers(prev => prev.map(item => (item.code === customerID ? itemDataFromForm : item)));      
      }

      //setError(null);
      closeModal(); // Đổi tên hàm này cho nhất quán
      return true;

    } catch (error) {
      //setError(error.message);
      console.error(`Lỗi khi lưu nhà cung cấp:`, error);
      return false;
    }

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
          onClick={openAddNewModal}
        >
          Add New Item
        </button>
      </header>

      <CustomerTable
        customers={fetchedCustomers}
        onOpenDetails={openDetailsModal}
        onEditItem={openEditModal}
        onRemoveItem={removeItem}
      />

      {isModalOpen && (
        <CustomerModal
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

export default CustomerManagement;
