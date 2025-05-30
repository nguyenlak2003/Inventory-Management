import React, { useState, useEffect, useRef } from "react";

function EmployeeForm({ itemToEdit, onSave, onCancel, isAddingNew }) {
  const [form, setForm] = useState(itemToEdit || {});
  const [page, setPage] = useState(1); // State to track the current page
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Khởi tạo form với giá trị từ 'item' hoặc giá trị mặc định nếu 'item' không tồn tại (thêm mới)
    const initialFormState = itemToEdit
      ? {
          ...itemToEdit,
          dob: itemToEdit.dob ? new Date(itemToEdit.dob).toISOString().split("T")[0] : "",
          password: "",
        }
      : {
          code: "",
          name: "",
          email: "",
          gender: "",
          dob: "",
          phone: "",
          address: "",
          username: "",
          password: "", // Mật khẩu trống cho nhân viên mới, yêu cầu nhập
          role: "",
        };
    setForm(initialFormState);
    setPage(1); // Reset về trang đầu tiên khi modal mở hoặc item thay đổi
  }, [itemToEdit]); // Không thêm isAddingNew vào đây trừ khi nó ảnh hưởng đến việc khởi tạo item

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <form
        className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[95vw] md:max-w-[600px]" // Tăng max-width cho desktop
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-6 text-red-700 border-b-2 border-red-700 pb-2">
          {isAddingNew
            ? "Thêm nhân viên mới"
            : `Chỉnh sửa thông tin: ${itemToEdit?.name || itemToEdit?.code}`}
        </h2>

        {/* Phân trang nội dung form */}
        {page === 1 ? (
          // Trang 1: Thông tin cơ bản
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Employee ID
                </label>
                <input
                  ref={firstInputRef}
                  name="code"
                  value={form.code || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm bg-gray-50"
                  required
                  readOnly={!isAddingNew} // Chỉ đọc mã NV khi chỉnh sửa
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-8">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 text-sm"
                onClick={() => setPage(2)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          // Trang 2: Thông tin chi tiết và tài khoản
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Day of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob || ""} // Đảm bảo form.dob là định dạng YYYY-MM-DD
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div className="md:col-span-2">
                {" "}
                {/* Địa chỉ chiếm full_width trên md */}
                <label className="block mb-1 font-medium text-sm">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  value={form.address || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password || ""} // Sẽ trống ban đầu
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder={
                    isAddingNew ? "Nhập mật khẩu" : "Để trống nếu không đổi"
                  }
                  required={isAddingNew} // Bắt buộc nhập mật khẩu khi thêm mới
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                >
                  <option value="">Chọn vai trò</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="user">Người dùng (User)</option>
                  <option value="manager">Quản lý (Manager)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2 mt-8">
              {" "}
              {/* justify-between để nút Back về bên trái */}
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={() => setPage(1)}
              >
                Previous
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 text-sm"
                >
                  {isAddingNew ? "ADD NEW" : "SAVE CHANGES"}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default EmployeeForm;