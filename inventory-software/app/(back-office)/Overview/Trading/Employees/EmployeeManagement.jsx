"use client";

import React, { useState, useRef, useEffect } from "react";
import EmployeeTable from "./EmployeeTable";
import EmployeeModal from "./EmployeeModal";
import { useRouter } from 'next/navigation';

function EmployeeManagement() {
  const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [lastFocusedElement, setLastFocusedElement] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
  
    const closeButtonRef = useRef(null);
    
    const [fetchedEmployees, setFetchedEmployees] = useState([]);
  
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchedEmployeesData = async () => {
      const token = localStorage.getItem("token");

      if (!token) { 
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dữ liệu.");
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/employees`, {
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
          code: item.EmployeeID,
          name: item.EmployeeName,
          phone: item.PhoneNumber,
          address: item.Addr,
          email: item.Email,
          gender: item.Gender,
          dob: item.DateOfBirth,
          username: item.username,
          role: item.Role
        }));
        
        setFetchedEmployees(mappedData);

      } catch (err) {
        console.error("Error fetching Customer:", err);
      }
    }

    fetchedEmployeesData();
    //console.log(fetchedEmployees);
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

        const response = await fetch(`${apiUrl}/api/employees/next-code/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy mã nhân viên mới từ server.');
        }

        const data = await response.json();
        setLastFocusedElement(document.activeElement);

        setSelectedItem({
            code: data.nextCode, 
            name: "",
            phone: "",
            address: "",
            email: "",
            gender: "",
            dob: "",
            username: "",
            password: "",
            role: "",
        });

        setIsEditing(true);
        setIsAddingNew(true);
        setIsModalOpen(true);

    } catch (error) {
        console.error("Lỗi khi mở form thêm mới:", error);
        alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }

  };

  const removeItem = async (employeeID) => {
    if(confirm("Are you sure you want to remove this item?")) {
      const token = localStorage.getItem('token');

      if(!token) {
        setError("Bạn chưa đăng nhập hoặc lỗi cấu hình");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/employees/${employeeID}/deActive`, {
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
        setFetchedEmployees(prevEmployees =>
        prevEmployees.filter((item) => item.code !== employeeID));   

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

    const employeeID = itemDataFromForm.code;

    const payload = {
      EmployeeID: itemDataFromForm.code,
      EmployeeName: itemDataFromForm.name,
      PhoneNumber: itemDataFromForm.phone,
      Addr: itemDataFromForm.address,
      Email: itemDataFromForm.email,
      Gender: itemDataFromForm.gender,
      DateOfBirth: itemDataFromForm.dob,
      Username: itemDataFromForm.username,
      Password: itemDataFromForm.password,
      Role: itemDataFromForm.role,
    };

    const method = isAddingNew ? "POST" : "PUT";
    const endpoint = isAddingNew 
      ? `${apiUrl}/api/employees` 
      : `${apiUrl}/api/employees/${employeeID}`;

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
        setFetchedEmployees(prev => [...prev, itemDataFromForm]);
      } else { // Editing
        setFetchedEmployees(prev => prev.map(item => (item.code === employeeID ? itemDataFromForm : item)));      
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
    console.log("Closing modal. Current isModalOpen:", isModalOpen);
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
    setIsAddingNew(false);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
    console.log("Modal closed. New isModalOpen should be false.");
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
          EMPLOYEES
        </h1>
        <button
          className="px-6 py-3 text-base bg-red-700 rounded cursor-pointer border-[none] text-[white]"
          onClick={openAddNewModal}
        >
          Add New Item
        </button>
      </header>

      <EmployeeTable
        employees={fetchedEmployees}
        onOpenDetails={openDetailsModal}
        onEditItem={openEditModal}
        onRemoveItem={removeItem}
      />

      {isModalOpen && (
        <EmployeeModal
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

export default EmployeeManagement;
