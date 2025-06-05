import React from "react"; // Bỏ useState nếu không dùng
import ActionButton from "./ActionButton";

function InventoryTable({
    inventory,
    onOpenDetails, 
    onEditItem,   
    onRemoveItem,
}) {
    
    if (!inventory || inventory.length === 0) {
        return <div className="p-10 text-base text-center text-zinc-600">Không có sản phẩm nào để hiển thị.</div>;
    }

    return (
        <div className="overflow-auto rounded-lg bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <table
                role="table"
                aria-label="Inventory Items"
                className="w-full border-separate border-spacing-0 max-sm:text-sm border border-gray-300"
            >
                <thead>
                    <tr className="bg-red-700 text-[white]">
                        <th scope="col" className="px-6 py-5 text-base font-semibold text-left">Item Code</th>
                        <th scope="col" className="p-4 text-left">Name</th>
                        <th scope="col" className="p-4 text-left">Quantity</th>
                        <th scope="col" className="p-4 text-left">Unit</th>
                        <th scope="col" className="p-4 text-left">Category</th>
                        <th scope="col" className="px-3 py-4 text-center">Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory?.map((item) => (
                        <TableRow
                            key={item.code} // Dùng ProductID (item.code) làm key
                            item={item}
                            onOpenDetails={onOpenDetails} // Truyền prop này xuống
                            onEditItem={onEditItem}     // Truyền prop này xuống
                            onRemoveItem={onRemoveItem}
                            // isModalOpen={isModalOpen} // Không cần thiết cho TableRow nếu modal quản lý ở cấp cao hơn
                        />
                    ))}
                </tbody>
            </table>
            {/* EditItemModal sẽ được render bởi InventoryManagement */}
        </div>
    );
}

function TableRow({
    item,
    onOpenDetails,
    onEditItem, // Nhận hàm từ props
    onRemoveItem,
    // isModalOpen, // Không cần
}) {
return (
  <tr className="border-b border-solid border-b-zinc-100 text-black">
    <td className="px-6 py-5 text-base border border-gray-300">{item.code}</td>
    <td className="p-4 border border-gray-300">{item.name}</td>
    <td className="p-4 border border-gray-300">{item.quantity}</td>
    <td className="p-4 border border-gray-300">{item.unit}</td>
    <td className="p-4 border border-gray-300">{item.category}</td>
    <td className="px-3 py-5 text-center border border-gray-300">
      <div className="flex gap-2.5 justify-center">
        <ActionButton
          variant="primary"
          onClick={() => onOpenDetails(item)} // Gọi onOpenDetails
          className="min-w-[100px]"
        >
          Details
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => onEditItem(item)}> {/* Gọi onEditItem */}
          Edit
        </ActionButton>
        <ActionButton variant="danger" onClick={() => onRemoveItem(item.code)}>
          Remove
        </ActionButton>
      </div>
    </td>
  </tr>
);
}

export default InventoryTable;