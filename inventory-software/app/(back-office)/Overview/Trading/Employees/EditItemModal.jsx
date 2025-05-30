// EditItemModal.jsx (Component EmployeeForm)
import React, { useState, useEffect, useRef, useCallback } from "react";

function EmployeeForm({ itemToEdit, onSave, onCancel, isAddingNew, onUsernameCheck }) {
  const [form, setForm] = useState({});
  const [page, setPage] = useState(1);
  const firstInputRef = useRef(null); // Ref cho input đầu tiên của trang 1

  // State cho việc kiểm tra username
  const [usernameValid, setUsernameValid] = useState(true); // Ban đầu coi là hợp lệ
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [initialUsername, setInitialUsername] = useState(""); // Lưu username ban đầu khi edit

  const usernameDebounceTimeoutRef = useRef(null);

  useEffect(() => {
    const dobFormatted = itemToEdit?.dob 
      ? new Date(itemToEdit.dob).toISOString().split("T")[0] 
      : "";

    const initialFormState = itemToEdit
      ? {
          ...itemToEdit,
          dob: dobFormatted,
          password: "", // Mật khẩu luôn trống khi chỉnh sửa, người dùng có thể điền để thay đổi
        }
      : { // Giá trị mặc định cho form thêm mới
          code: "", name: "", email: "", gender: "", dob: "",
          phone: "", address: "", username: "", password: "", role: "",
        };
    setForm(initialFormState);
    setPage(1); // Luôn reset về trang 1
    setUsernameValid(true); // Reset trạng thái kiểm tra username
    setUsernameMessage("");
    setIsCheckingUsername(false);
    if (itemToEdit && itemToEdit.username) {
        setInitialUsername(itemToEdit.username); // Lưu username ban đầu khi edit
    } else {
        setInitialUsername("");
    }

    // Focus vào input đầu tiên khi modal mở hoặc item thay đổi và đang ở trang 1
    if (page === 1 && firstInputRef.current) {
        setTimeout(() => firstInputRef.current.focus(), 100); // Timeout nhỏ để đảm bảo DOM sẵn sàng
    }
  }, [itemToEdit, isAddingNew]); // Thêm isAddingNew vì nó cũng ảnh hưởng đến việc khởi tạo form


  // Hàm kiểm tra username (được gọi bởi debounce)
  const checkUsername = useCallback(async (usernameToCheck) => {
    if (!onUsernameCheck) return;

    // Nếu là chỉnh sửa và username không thay đổi so với ban đầu, không cần kiểm tra
    if (!isAddingNew && itemToEdit && usernameToCheck === initialUsername) {
        setUsernameValid(true);
        setUsernameMessage("");
        setIsCheckingUsername(false);
        return;
    }
    
    // Nếu username trống, coi như hợp lệ (hoặc không, tùy yêu cầu bắt buộc)
    if (!usernameToCheck.trim()) {
        setUsernameValid(false); // Hoặc false nếu username là bắt buộc và trống
        setUsernameMessage(""); // Xóa thông báo
        setIsCheckingUsername(false);
        return;
    }

    setIsCheckingUsername(true);
    const excludeId = itemToEdit.code;
    const result = await onUsernameCheck(usernameToCheck, excludeId);
    console.log(excludeId)
    console.log(usernameToCheck)
    console.log(result)
    setUsernameValid(result.available);
    setUsernameMessage(result.message);
    setIsCheckingUsername(false);

  }, [onUsernameCheck, itemToEdit, isAddingNew, initialUsername]); // Thêm initialUsername vào dependencies


  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "username") {
        // Xóa thông báo cũ và trạng thái loading khi người dùng bắt đầu gõ
        setUsernameMessage("");
        setIsCheckingUsername(true); // Hiển thị "Đang kiểm tra..."
        setUsernameValid(true); // Tạm thời coi là hợp lệ trong lúc gõ

        if (usernameDebounceTimeoutRef.current) {
            clearTimeout(usernameDebounceTimeoutRef.current);
        }
        usernameDebounceTimeoutRef.current = setTimeout(() => {
            checkUsername(value); // Gọi hàm kiểm tra username sau khi ngừng gõ
        }, 800); // Thời gian chờ: 800ms
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Kiểm tra username một lần nữa trước khi submit, đặc biệt nếu người dùng submit nhanh
    if (form.username && form.username !== initialUsername) { // Chỉ kiểm tra nếu username có giá trị và đã thay đổi
        if (isCheckingUsername) {
            alert("Đang kiểm tra username, vui lòng đợi.");
            return;
        }
        if (!usernameValid) {
            alert("Username không hợp lệ. Vui lòng chọn username khác.");
            return;
        }
    }
    
    // Kiểm tra các trường bắt buộc của trang hiện tại trước khi submit (nếu đang ở trang 2)
    // Hoặc kiểm tra tất cả nếu form không phân trang hoặc logic khác
    if (page === 2) {
        const requiredFieldsP2 = ['dob', 'phone', 'address', 'username', 'role'];
        if (isAddingNew) requiredFieldsP2.push('password');

        for (const field of requiredFieldsP2) {
            if (!form[field] || String(form[field]).trim() === "") { // Kiểm tra cả null, undefined và chuỗi rỗng
                alert(`Vui lòng điền đầy đủ thông tin cho trường '${getFieldLabel(field)}'.`);
                // Tùy chọn: focus vào trường bị lỗi
                const fieldElement = document.getElementsByName(field)[0];
                if (fieldElement) fieldElement.focus();
                return;
            }
        }
    } else if (page === 1) { // Đảm bảo các trường trang 1 cũng được điền nếu submit từ trang 1 (ít xảy ra với logic Next/Prev)
        const requiredFieldsP1 = ['code', 'name', 'email', 'gender'];
         for (const field of requiredFieldsP1) {
            if (!form[field] || String(form[field]).trim() === "") {
                alert(`Vui lòng điền đầy đủ thông tin cho trường '${getFieldLabel(field)}'.`);
                const fieldElement = document.getElementsByName(field)[0];
                if (fieldElement) fieldElement.focus();
                return;
            }
        }
    }


    const success = await onSave(form); 
    // EmployeeManagement sẽ đóng modal nếu lưu thành công
    if (!success) {
        // alert("Lưu thông tin thất bại. Vui lòng kiểm tra lại."); // Thông báo lỗi đã được EmployeeManagement xử lý
    }
  }
  
  // Hàm trợ giúp để lấy nhãn trường cho thông báo lỗi
  function getFieldLabel(fieldName) {
    const labels = {
        code: "Mã nhân viên", name: "Họ tên", email: "Email", gender: "Giới tính",
        dob: "Ngày sinh", phone: "Số điện thoại", address: "Địa chỉ",
        username: "Username", password: "Mật khẩu", role: "Vai trò"
    };
    return labels[fieldName] || fieldName;
  }


  const canProceedToNextPage = () => {
    if (page === 1) {
        const requiredFieldsP1 = ['code', 'name', 'email', 'gender'];
        for (const field of requiredFieldsP1) {
            if (!form[field] || String(form[field]).trim() === "") {
                alert(`Vui lòng điền đầy đủ thông tin cho trường '${getFieldLabel(field)}'.`);
                const fieldElement = document.getElementsByName(field)[0];
                if (fieldElement) fieldElement.focus();
                return false;
            }
        }
        // Kiểm tra định dạng email cơ bản
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            alert("Định dạng email không hợp lệ.");
            const fieldElement = document.getElementsByName("email")[0];
            if (fieldElement) fieldElement.focus();
            return false;
        }
    }
    return true;
  };

  const handleNextPage = () => {
    if (canProceedToNextPage()) {
        setPage(2);
        // Tùy chọn: focus vào input đầu tiên của trang 2
        // Cần đảm bảo input đó đã render, có thể dùng setTimeout hoặc ref nếu phức tạp
    }
  };

  return (
    <form
        className="bg-white rounded-lg min-w-[300px] w-full" // Bỏ max-width ở đây vì EmployeeModal đã có
        onSubmit={handleSubmit}
        noValidate // Tắt validation mặc định của trình duyệt
    >
        {page === 1 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div>
                <label htmlFor="code" className="block mb-1 font-medium text-sm">
                  Mã nhân viên <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  ref={firstInputRef} // Gán ref cho input này
                  name="code"
                  value={form.code || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm bg-gray-100" // Để bg-gray-100 cho readOnly
                  required
                  readOnly // Chỉ cho phép sửa mã NV khi thêm mới
                />
              </div>
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-sm">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-sm">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block mb-1 font-medium text-sm">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 border-t pt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                onClick={onCancel}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 text-sm font-medium"
                onClick={handleNextPage}
              >
                Tiếp theo &rarr;
              </button>
            </div>
          </>
        ) : (
          // Trang 2: Thông tin chi tiết và tài khoản
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div>
                <label htmlFor="dob" className="block mb-1 font-medium text-sm">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={form.dob || ""} 
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1 font-medium text-sm">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block mb-1 font-medium text-sm">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block mb-1 font-medium text-sm">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500 ${!usernameValid && form.username && form.username.trim() !== "" ? 'border-red-500 ring-red-500' : (usernameValid && form.username && form.username.trim() !== "" && !isCheckingUsername ? 'border-green-500 ring-green-500' : '')}`}
                  required
                  aria-describedby="username-feedback"
                />
                <div id="username-feedback" className="text-xs mt-1 h-4"> {/* h-4 để giữ chiều cao ổn định */}
                    {isCheckingUsername && <span className="text-gray-500">Đang kiểm tra...</span>}
                    {!isCheckingUsername && usernameMessage && form.username && form.username.trim() !== "" && (
                        <span className={usernameValid ? "text-green-600" : "text-red-600"}>
                            {usernameMessage}
                        </span>
                    )}
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-sm">
                  Mật khẩu {isAddingNew && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password || ""} 
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  placeholder={
                    isAddingNew ? "Nhập mật khẩu mới" : "Để trống nếu không đổi"
                  }
                  required={isAddingNew} 
                />
              </div>
              <div>
                <label htmlFor="role" className="block mb-1 font-medium text-sm">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">-- Chọn vai trò --</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="manager">Quản lý (Manager)</option>
                  <option value="user">Người dùng (User)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 mt-8 border-t pt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                onClick={() => setPage(1)}
              >
                &larr; Quay lại
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                  onClick={onCancel}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 text-sm font-medium disabled:opacity-50"
                  disabled={isCheckingUsername || (!usernameValid && form.username && form.username.trim() !== "")} // Vô hiệu hóa nút nếu đang kiểm tra hoặc username không hợp lệ và không rỗng
                >
                  {isAddingNew ? "THÊM MỚI" : "LƯU THAY ĐỔI"}
                </button>
              </div>
            </div>
          </>
        )}
    </form>
  );
}

export default EmployeeForm;