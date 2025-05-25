"use client";

import React, { useState, useRef, useEffect } from "react";
import InventoryTable from "./InventoryTable"; // File 2KB
import InventoryModal from "./InventoryModal"; // File 7KB (chứa cả ItemDetails và EditForm)
import { useRouter } from 'next/navigation';

function InventoryManagement() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // true: EditForm, false: ItemDetails hoặc AddForm
  const [isAddingNew, setIsAddingNew] = useState(false); // State mới để phân biệt Add New

  const closeButtonRef = useRef(null);

  const [fetchedInventory, setFetchedInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userRole, setUserRole] = useState(null);

  const category = "Electronics";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!apiUrl) { 
      console.error("API is not defined");
      setError("Không thấy API");
      setIsLoading(false);
      return;
    }

    const fetchInventoryData = async () => {
      setIsLoading(true); 
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) { 
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
        }

        const data = await response.json();

        const mappedData = data.inventory.map(item => ({
          id: (typeof item.ProductID === 'string' && item.ProductID.length >= 3) ? item.ProductID.slice(-3) : item.ProductID,
          code: item.ProductID,
          categoryID: item.CategoryID,
          name: item.ProductName,
          quantity: item.Quantity,
          sellPrice: parseFloat(item.SellingPrice),
          buyPrice: parseFloat(item.ImportPrice),
          description: item.Description,
          unit: item.UnitOfMeasure,
          providers: item.SupplierName ? [item.SupplierName] : [], 
          category: item.CategoryName,
          billingNumber: "", 
          purchaseDate: "",  
        }));

        setFetchedInventory(mappedData);
        setUserRole(data.userRole);

      } catch (err) {
        console.error(`Lỗi khi fetch inventory cho category '${category}':`, err);
        setError(err.message || "Không thể tải dữ liệu inventory.");
        setFetchedInventory([]);
      }
      finally { setIsLoading(false); }
    };

    fetchInventoryData();
  }, [category, apiUrl, router]);


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
    setSelectedItem(item); // Item từ bảng
    setIsEditing(true);    // QUAN TRỌNG: Để hiển thị EditForm
    setIsAddingNew(false);
    setIsModalOpen(true);
    setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);
  };

  const openAddNewModal = async () => {
    const categoryIDForNewItem = fetchedInventory.length > 0 ? fetchedInventory[0].categoryID : null;
    
    if (!categoryIDForNewItem) {
      alert("Không thể thêm sản phẩm mới vì không xác định được mã loại hàng. Vui lòng đảm bảo loại hàng này có ít nhất một sản phẩm.");
      return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/inventory/next-code/${categoryIDForNewItem}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy mã sản phẩm mới từ server.');
        }

        const data = await response.json();
        const nextItemCode = data.nextCode;

        setLastFocusedElement(document.activeElement);
        setSelectedItem({
            code: nextItemCode, 
            name: "",
            quantity: 0,
            sellPrice: 0,
            buyPrice: 0,
            providers: [],
            billingNumber: "",
            purchaseDate: new Date().toISOString().split("T")[0],
            description: "",
            unit: "",
            category: category,
            categoryID: categoryIDForNewItem,
        });

        setIsEditing(true);
        setIsAddingNew(true);
        setIsModalOpen(true);

    } catch (error) {
        console.error("Lỗi khi mở form thêm mới:", error);
        alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };


  async function removeItem(productCode) {
    if (confirm("Are you sure you want to remove this item?")) {
      const token = localStorage.getItem('token');

      if(!token) {
        setError("Bạn chưa đăng nhập hoặc lỗi cấu hình");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/inventory/items/${productCode}/deActive`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
          }
        });

        console.log(response);

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

        setFetchedInventory(prevInventory =>
        prevInventory.filter((item) => item.code !== productCode));

        console.log(`Sản phẩm với ID ${productCode} đã được đánh dấu là không hoạt động trên server và ẩn khỏi giao diện.`);
      } catch (err) {
        
      }
    }
  }

  // Hàm saveItem sẽ xử lý cả Add và Edit
  async function saveItem(itemDataFromForm) { 
    const token = localStorage.getItem('token');
    if (!apiUrl || !token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dữ liệu.");
      setIsLoading(false);
      router.replace("/login");  
      return false;
    }

    const productID = itemDataFromForm.code;

    const payload = {
      code: productID, 
      name: itemDataFromForm.name,
      quantity: itemDataFromForm.quantity,
      sellPrice: itemDataFromForm.sellPrice,
      buyPrice: itemDataFromForm.buyPrice,
      description: itemDataFromForm.description,
      unit: itemDataFromForm.unit,
      categoryName: itemDataFromForm.category,
      categoryID: itemDataFromForm.categoryID,
      // Gửi categoryName cho backend
      // providers, billingNumber, purchaseDate nếu backend xử lý việc lưu chúng
    };

    var response;
    var endpoint = "";
    var method = "";

    try {
      if (isAddingNew) { 
        method = 'POST';
        endpoint = `${apiUrl}/api/inventory/items`; // API POST để thêm mới
      } else { // Nếu đang chỉnh sửa (isEditing=true và isAddingNew=false)
        method = 'PUT';
        endpoint = `${apiUrl}/api/inventory/items/${productID}`; // API PUT để cập nhật
        if (!productID) {
            setError("Không có ProductID để cập nhật.");
            return false;
        }
      }

      response = await fetch(endpoint, {
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

      const result = await response.json();
      const savedItemFromApi = result.item;

      const reMappedSavedItem = { /* ... ánh xạ dữ liệu từ API về dạng frontend ... */
        id: (typeof savedItemFromApi.ProductID === 'string' && savedItemFromApi.ProductID.length >= 3) ? savedItemFromApi.ProductID.slice(-3) : savedItemFromApi.ProductID,
        code: savedItemFromApi.ProductID,
        name: savedItemFromApi.ProductName,
        quantity: savedItemFromApi.Quantity,
        sellPrice: parseFloat(savedItemFromApi.SellingPrice),
        buyPrice: parseFloat(savedItemFromApi.ImportPrice),
        description: savedItemFromApi.Description,
        unit: savedItemFromApi.UnitOfMeasure,
        category: savedItemFromApi.CategoryName,
        providers: savedItemFromApi.SupplierName ? [savedItemFromApi.SupplierName] : [],
        billingNumber: itemDataFromForm.billingNumber, // Giữ lại từ form nếu backend không trả về
        purchaseDate: itemDataFromForm.purchaseDate,   // Giữ lại từ form
      };

      if (isAddingNew) {
        setFetchedInventory(prev => [...prev, reMappedSavedItem]);
      } else { // Editing
        setFetchedInventory(prev => prev.map(item => (item.code === productID ? reMappedSavedItem : item)));
      }

      setError(null);
      closeModal(); // Đổi tên hàm này cho nhất quán
      return true;
    } catch (err) {
      console.error(`Lỗi khi ${isAddingNew ? "thêm mới" : "cập nhật"} sản phẩm:`, err);
      setError(err.message || `Không thể ${isAddingNew ? "thêm mới" : "cập nhật"} sản phẩm.`);
        return false;
      }
  }

  function closeModal() { // Đổi tên từ closeModalAction
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
            {category.toUpperCase()} 
          </h1>
          <button
            className="px-6 py-3 text-base bg-red-700 rounded cursor-pointer border-[none] text-[white] transition-all duration-200 ease-in-out hover:bg-red-800 hover:scale-105 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            onClick={openAddNewModal}
            disabled={userRole !== 'admin'} // Vô hiệu hóa nút nếu vai trò không phải 'admin'
            title={userRole !== 'admin' ? "Chỉ tài khoản Admin mới có thể thêm sản phẩm" : "Thêm sản phẩm mới"}
          >
            Add New Item
          </button>
        </header>

         {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Lỗi!</span> {error}
        </div>
      )}

        <InventoryTable
          inventory={fetchedInventory}
          onOpenDetails={openDetailsModal}
          onEditItem={openEditModal}     
          onRemoveItem={removeItem}
        />

        {isModalOpen && ( 
          <InventoryModal 
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

export default InventoryManagement;