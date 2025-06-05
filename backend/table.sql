
--0. Nhân viên
CREATE TABLE Employee (
    username VARCHAR(20) PRIMARY KEY,
    password VARCHAR(100),
    Role VARCHAR(50) DEFAULT 'User',
    EmployeeID VARCHAR(50),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);
GO
insert into Employee(username,password,Role,EmployeeID) values ('admin','admin','admin','EMP001');

--1. Nhà Cung Cấp (Suppliers)
CREATE TABLE Suppliers (
    SupplierID VARCHAR(50) PRIMARY KEY,
    SupplierName NVARCHAR(255),
    Addr NVARCHAR(255),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    IsActive BIT DEFAULT 1
);
GO

--2. Loại Sản Phẩm (Product Categories) 
CREATE TABLE ProductCategories (
    CategoryID VARCHAR(50) PRIMARY KEY,
    CategoryName NVARCHAR(255) NOT NULL
);
GO

--3. Kho (Warehouses) 
CREATE TABLE Warehouses (
    WarehouseID VARCHAR(50) PRIMARY KEY,
    WarehouseName NVARCHAR(255),
    Addr NVARCHAR(255)
);
GO

--4. Khách Hàng (Customers) 
CREATE TABLE Customers (
    CustomerID VARCHAR(50) PRIMARY KEY,
    CustomerName NVARCHAR(255),
    Addr NVARCHAR(255),
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    IsActive BIT DEFAULT 1
);
GO

--5. Nhân Viên (Employees) 
CREATE TABLE Employees (
    EmployeeID VARCHAR(50) PRIMARY KEY, 
    EmployeeName NVARCHAR(255),
    DateOfBirth DATE,
    Gender NVARCHAR(10),
    Addr NVARCHAR(200),
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20)
);
GO

--6. Sản Phẩm (Products) 
CREATE TABLE Products (
    ProductID VARCHAR(50) PRIMARY KEY, 
    ProductName NVARCHAR(255),
    Description NVARCHAR(MAX), 
    UnitOfMeasure NVARCHAR(50),
    ImportPrice DECIMAL(18, 2),
    SellingPrice DECIMAL(18, 2),
    SupplierID VARCHAR(50),
    CategoryID VARCHAR(50),
    IsActive BIT DEFAULT 1
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (CategoryID) REFERENCES ProductCategories(CategoryID)
);
GO

--7. Phiếu Nhập Kho (InboundOrders) 
CREATE TABLE InboundOrders (
    InboundOrderID VARCHAR(50) PRIMARY KEY, 
    SupplierID VARCHAR(50),
    EmployeeID VARCHAR(50),
    DateOfReceipt DATETIME,
    TotalAmount DECIMAL(18, 2),
    Notes NVARCHAR(MAX),
    IsActive BIT DEFAULT 1
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);
GO

--8. Phiếu Xuất Kho (OutboundOrders)
CREATE TABLE OutboundOrders (
    OutboundOrderID VARCHAR(50) PRIMARY KEY, 
    CustomerID VARCHAR(50),
    EmployeeID VARCHAR(50),
    DispatchDate DATETIME,
    TotalAmount DECIMAL(18, 2),
    Notes NVARCHAR(MAX),
    IsActive BIT DEFAULT 1
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);
GO

--9. Chi Tiết Phiếu Nhập Kho (InboundOrderDetails)
CREATE TABLE InboundOrderDetails (
    InboundOrderID VARCHAR(50),
    ProductID VARCHAR(50),
    WarehouseID VARCHAR(50),
    QuantityReceived INT,
    UnitPrice DECIMAL(18, 2),
    LineTotal DECIMAL(18, 2),
    FOREIGN KEY (InboundOrderID) REFERENCES InboundOrders(InboundOrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID), 
	PRIMARY KEY (InboundOrderID, ProductID, WarehouseID)
);
GO

--10. Chi Tiết Phiếu Xuất Kho (OutboundOrderDetails)
CREATE TABLE OutboundOrderDetails (
    OutboundOrderID VARCHAR(50),
    ProductID VARCHAR(50),
    WarehouseID VARCHAR(50),
    UnitPrice DECIMAL(18, 2),
    QuantityDispatched INT,
    LineTotal DECIMAL(18, 2),
    FOREIGN KEY (OutboundOrderID) REFERENCES OutboundOrders(OutboundOrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
	PRIMARY KEY (OutboundOrderID, ProductID, WarehouseID)
);
GO

--11. Hàng Trong Kho (Inventory)
CREATE TABLE Inventory (
    ProductID VARCHAR(50),
    WarehouseID VARCHAR(50),
    Quantity INT,
    PRIMARY KEY (ProductID, WarehouseID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID)
);
GO

-- Constraints
-- Suppliers
ALTER TABLE Suppliers
ADD CONSTRAINT CK_Suppliers_Email CHECK (
    Email LIKE '%_@__%.__%' 
);
GO

ALTER TABLE Suppliers
ADD CONSTRAINT CK_Suppliers_Phone CHECK (
    PhoneNumber NOT LIKE '%[^0-9]%'
    AND LEN(PhoneNumber) BETWEEN 10 AND 11
);
GO

-- ProductCategories
ALTER TABLE ProductCategories
ADD CONSTRAINT CK_ProductCategories_Name CHECK (
	LEN(CategoryName) > 0
);
GO

-- Warehouses
ALTER TABLE Warehouses
ADD CONSTRAINT CK_Warehouses_Name CHECK (
	LEN(WarehouseName) > 0
);
GO

-- Customers
ALTER TABLE Customers
ADD CONSTRAINT CK_Customers_Email CHECK (
	Email LIKE '%_@__%.__%' 
);
GO

ALTER TABLE Customers
ADD CONSTRAINT CK_Customers_Phone CHECK (
	PhoneNumber NOT LIKE '%[^0-9]%'
    AND LEN(PhoneNumber) BETWEEN 10 AND 11
);
GO

-- Employees
ALTER TABLE Employees
ADD CONSTRAINT CK_Employees_Gender CHECK (
	Gender IN (N'Nam', N'Nữ', N'Khác')
);
GO

ALTER TABLE Employees
ADD CONSTRAINT CK_Employees_Email CHECK (
	Email LIKE '%_@__%.__%' 
);
GO

ALTER TABLE Employees
ADD CONSTRAINT CK_Employees_Phone CHECK (
	PhoneNumber NOT LIKE '%[^0-9]%'
    AND LEN(PhoneNumber) BETWEEN 10 AND 11
);
GO

ALTER TABLE Employees
ADD CONSTRAINT CHK_Employees_DateOfBirth CHECK (
	DateOfBirth <= DATEADD(year, -18, GETDATE())
);
GO

-- Products
ALTER TABLE Products
ADD CONSTRAINT CK_Products_ImportPrice CHECK (ImportPrice >= 0);
GO

ALTER TABLE Products
ADD CONSTRAINT CK_Products_SellingPrice CHECK (SellingPrice >= 0);
GO

-- InboundOrders
ALTER TABLE InboundOrders
ADD CONSTRAINT CK_InboundOrders_TotalAmount CHECK (TotalAmount >= 0);
GO

ALTER TABLE InboundOrders
ADD CONSTRAINT CHK_InboundOrders_Date CHECK (DateOfReceipt <= GETDATE());
GO

-- OutboundOrders
ALTER TABLE OutboundOrders
ADD CONSTRAINT CK_OutboundOrders_TotalAmount CHECK (TotalAmount >= 0);
GO

ALTER TABLE OutboundOrders
ADD CONSTRAINT CHK_OutboundOrders_Date CHECK (DispatchDate <= GETDATE());
GO

-- InboundOrderDetails
ALTER TABLE InboundOrderDetails	
ADD CONSTRAINT CK_InboundDetails_Quantity CHECK (QuantityReceived > 0);
GO

ALTER TABLE InboundOrderDetails
ADD CONSTRAINT CK_InboundDetails_UnitPrice CHECK (UnitPrice >= 0);
GO

ALTER TABLE InboundOrderDetails
ADD CONSTRAINT CK_InboundDetails_LineTotal CHECK (LineTotal >= 0);
GO

-- OutboundOrderDetails
ALTER TABLE OutboundOrderDetails
ADD CONSTRAINT CK_OutboundDetails_Quantity CHECK (QuantityDispatched > 0);
GO

ALTER TABLE OutboundOrderDetails
ADD CONSTRAINT CK_OutboundDetails_UnitPrice CHECK (UnitPrice >= 0);
GO

ALTER TABLE OutboundOrderDetails
ADD CONSTRAINT CK_OutboundDetails_LineTotal CHECK (LineTotal >= 0);
GO

-- Inventory
ALTER TABLE Inventory
ADD CONSTRAINT CK_Inventory_Quantity CHECK (Quantity >= 0);
GO

-- Lệnh Trigger
-- 1. Tính LineTotal cho bảng InboundOrderDetails
CREATE TRIGGER trg_CalcLineTotal_Inbound
ON InboundOrderDetails
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE IOD
    SET IOD.LineTotal = IOD.UnitPrice * IOD.QuantityReceived
    FROM InboundOrderDetails IOD
    JOIN inserted ins ON IOD.InboundOrderID = ins.InboundOrderID 
                      AND IOD.ProductID = ins.ProductID 
                      AND IOD.WarehouseID = ins.WarehouseID;
END;
GO

-- 2. Tính LineTotal cho bảng OutboundOrderDetails
CREATE TRIGGER trg_CalcLineTotal_Outbound
ON OutboundOrderDetails
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE OOD
    SET OOD.LineTotal = OOD.UnitPrice * OOD.QuantityDispatched
    FROM OutboundOrderDetails OOD
    JOIN inserted ins ON OOD.OutboundOrderID = ins.OutboundOrderID 
                      AND OOD.ProductID = ins.ProductID 
                      AND OOD.WarehouseID = ins.WarehouseID;
END;
GO

-- 3. Cập nhật TotalAmount cho bảng InboundOrders
CREATE TRIGGER trg_UpdateTotalAmount_Inbound
ON InboundOrderDetails
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    UPDATE IO
    SET TotalAmount = ISNULL((
        SELECT SUM(LineTotal) 
        FROM InboundOrderDetails 
        WHERE InboundOrderID = IO.InboundOrderID
    ), 0)
    FROM InboundOrders IO
    WHERE IO.InboundOrderID IN (
        SELECT InboundOrderID FROM inserted
        UNION
        SELECT InboundOrderID FROM deleted
    );
END;
GO

-- 4. Cập nhật TotalAmount cho bảng OutboundOrders
CREATE TRIGGER trg_UpdateTotalAmount_Outbound
ON OutboundOrderDetails
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    UPDATE OO
    SET TotalAmount = ISNULL((
        SELECT SUM(LineTotal) 
        FROM OutboundOrderDetails 
        WHERE OutboundOrderID = OO.OutboundOrderID
    ), 0)
    FROM OutboundOrders OO
    WHERE OO.OutboundOrderID IN (
        SELECT OutboundOrderID FROM inserted
        UNION
        SELECT OutboundOrderID FROM deleted
    );
END;
GO

-- 5. Cập nhật tồn kho khi nhập hàng
CREATE TRIGGER trg_UpdateInventory_OnInbound
ON InboundOrderDetails
AFTER INSERT
AS
BEGIN
    -- Cập nhật tồn kho nếu đã có
    UPDATE I
    SET I.Quantity = I.Quantity + ins.QuantityReceived
    FROM Inventory I
    JOIN inserted ins ON I.ProductID = ins.ProductID AND I.WarehouseID = ins.WarehouseID;

    -- Thêm mới nếu chưa có
    INSERT INTO Inventory (ProductID, WarehouseID, Quantity)
    SELECT ins.ProductID, ins.WarehouseID, ins.QuantityReceived
    FROM inserted ins
    LEFT JOIN Inventory I ON I.ProductID = ins.ProductID AND I.WarehouseID = ins.WarehouseID
    WHERE I.ProductID IS NULL;
END;
GO

-- 6. Kiểm tra và trừ tồn kho khi xuất hàng
CREATE TRIGGER trg_CheckAndSubtractInventory_OnOutbound
ON OutboundOrderDetails
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted ins
        LEFT JOIN Inventory I ON I.ProductID = ins.ProductID AND I.WarehouseID = ins.WarehouseID
        WHERE ISNULL(I.Quantity, 0) < ins.QuantityDispatched
    )
    BEGIN
        RAISERROR('Không đủ tồn kho để xuất hàng.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    UPDATE I
    SET I.Quantity = I.Quantity - ins.QuantityDispatched
    FROM Inventory I
    JOIN inserted ins ON I.ProductID = ins.ProductID AND I.WarehouseID = ins.WarehouseID;
END;
GO

INSERT INTO Employee(username,password,EmployeeID,Role) values
('admin','admin','EMP001','admin');
-- Database
-- 1. Product Categories
INSERT INTO ProductCategories (CategoryID, CategoryName) VALUES
('ELE', N'Electronics'),
('HOU', N'Housewares'),
('MSC', N'Miscellaneous');
GO

-- 2. Suppliers
INSERT INTO Suppliers (SupplierID, SupplierName, Addr, PhoneNumber, Email)
VALUES
('SUP001', N'Công ty Gia Dụng Việt', N'Hà Nội', '0901234567', 'giadungviet@example.com'),
('SUP002', N'Tập Đoàn Toàn Cầu JSC', N'Hà Nội', '0901234567', 'giadungviet@example.com'),
('SUP003', N'Đại lý Thiết Bị Hùng Phát', N'Cần Thơ', '0934567890', 'hungphat.tb@example.com'),
('SUP004', N'Công ty TNHH Thiết Bị Ánh Dương', N'Bắc Ninh', '0945678901', 'anhduong.equipment@example.com'),
('SUP005', N'Thiết Bị Điện Hòa Phát', N'Hồ Chí Minh', '0987654321', 'dienhoaphat@example.com'),
('SUP006', N'Công ty TNHH Điện Cơ Sài Gòn', N'Đà Nẵng', '0912345678', 'diencosaigon@example.com'),
('SUP007', N'Tập Đoàn Gia Dụng Minh Long', N'Bình Dương', '0923456789', 'minhlonggd@example.com'),
('SUP008', N'Nhà Phân Phối Hòa An', N'Quảng Ninh', '0956789012', 'hoaan.trading@example.com');

-- 3. Warehouses
INSERT INTO Warehouses (WarehouseID, WarehouseName, Addr)
VALUES
('WH001', N'Kho miền Bắc', N'Hà Nội'),
('WH002', N'Kho miền Nam', N'Hồ Chí Minh'),
('WH003', N'Kho miền Trung', N'Đà Nẵng'),
('WH004', N'Kho Bình Dương', N'Bình Dương'),
('WH005', N'Kho Cần Thơ', N'Cần Thơ'),
('WH006', N'Kho Hải Phòng', N'Hải Phòng'),
('WH007', N'Kho Bắc Giang', N'Bắc Giang'),
('WH008', N'Kho Thanh Hóa', N'Thanh Hóa');

INSERT INTO Customers (CustomerID, CustomerName, Addr, Email, PhoneNumber)
VALUES
('CUST001', N'Anh Tuấn Store', N'Hà Nội', 'tuanstore@gmail.com', '0901122334'),
('CUST002', N'Cửa Hàng Điện Máy Hà Linh', N'Hồ Chí Minh', 'halinh@gmail.com', '0912233445'),
('CUST003', N'Đại Lý Gia Dụng Mai Anh', N'Đà Nẵng', 'maianh_gd@gmail.com', '0923344556'),
('CUST004', N'Trung Tâm Thiết Bị Tân Phát', N'Hải Phòng', 'tanphatcenter@gmail.com', '0934455667'),
('CUST005', N'Cửa Hàng Minh Hương', N'Cần Thơ', 'minhhuong.ch@gmail.com', '0945566778'),
('CUST006', N'Siêu Thị Điện Gia Dụng Lộc Phát', N'Bình Dương', 'locphat.st@gmail.com', '0956677889'),
('CUST007', N'Đại Lý Thiết Bị Linh Trang', N'Quảng Ninh', 'linhtrang.tb@gmail.com', '0967788990'),
('CUST008', N'Điện Máy Nhật Minh', N'Thanh Hóa', 'nhatminhdm@gmail.com', '0978899001');

-- 4. Employees
INSERT INTO Employees (EmployeeID, EmployeeName, DateOfBirth, Gender, Addr, Email, PhoneNumber)
VALUES
('EMP001', N'Phạm Ngọc Thạch', '1990-01-01', N'Nam', N'Hà Nội', 'ngthach@example.com', '0911222333'),
('EMP002', N'Đàm Ngọc San', '1992-02-02', N'Nữ', N'HCM', 'dsan@example.com', '0933444555'),
('EMP003', N'Nguyễn Phùng Trung Ngu', '1988-03-15', N'Nữ', N'Đà Nẵng', 'ngunp@example.com', '0912345678'),
('EMP004', N'Lu Nhật Duy', '1993-07-22', N'Nữ', N'Bình Dương', 'hongle@example.com', '0923456789'),
('EMP005', N'Vũ Văn Nam', '1985-11-09', N'Nam', N'Hải Phòng', 'namvv@example.com', '0934567890'),
('EMP006', N'Ngô Thị Mai', '1990-05-10', N'Nữ', N'Cần Thơ', 'maingo@example.com', '0945678901'),
('EMP007', N'Trịnh Quốc Hưng', '1987-09-30', N'Nam', N'Quảng Ninh', 'hungtq@example.com', '0956789012'),
('EMP008', N'Doãn Thị Lan', '1995-12-01', N'Nữ', N'Nghệ An', 'landoan@example.com', '0967890123');

-- 5. Products
INSERT INTO Products (ProductID, ProductName, Description, UnitOfMeasure, ImportPrice, SellingPrice, SupplierID, CategoryID)
VALUES
('HOU001', N'Nồi cơm điện Sharp', N'Nồi cơm 1.8L chống dính', N'Cái', 700000, 950000, 'SUP001', 'HOU'),
('HOU002', N'Bình siêu tốc Elmich', N'Bình đun nước siêu tốc inox 1.5L', N'Cái', 300000, 420000, 'SUP002', 'HOU'),
('HOU003', N'Máy sấy tóc Sunhouse', N'Công suất 1200W, 2 tốc độ gió', N'Cái', 180000, 250000, 'SUP003', 'HOU'), 
('HOU004', N'Cây lau nhà 360 độ', N'Bộ lau nhà xoay tay tiện dụng', N'Bộ', 150000, 230000, 'SUP004', 'HOU'),  
('ELE001', N'Máy hút bụi Electrolux', N'Hút bụi công suất lớn 1800W', N'Cái', 1200000, 1500000, 'SUP005', 'ELE'), 
('ELE002', N'Quạt đứng Panasonic', N'Quạt điện đứng 3 tốc độ', N'Cái', 600000, 850000, 'SUP006', 'ELE'), 
('ELE003', N'Bóng đèn LED Philips', N'9W ánh sáng trắng tiết kiệm điện', N'Cái', 20000, 35000, 'SUP007', 'ELE'), 
('MSC001', N'Túi đựng thực phẩm Zip', N'Túi nhựa nhiều kích thước', N'Túi', 30000, 50000, 'SUP008', 'MSC');

-- Inventory 
INSERT INTO Inventory (ProductID, WarehouseID, Quantity)
VALUES
('HOU001', 'WH001', 420),
('HOU002', 'WH001', 510),
('HOU003', 'WH001', 330),
('HOU004', 'WH001', 460),
('ELE001', 'WH001', 500),
('ELE002', 'WH001', 390),
('ELE003', 'WH001', 370),
('MSC001', 'WH001', 440);

-- 6. InboundOrders
INSERT INTO InboundOrders (InboundOrderID, SupplierID, EmployeeID, DateOfReceipt, TotalAmount, Notes)
VALUES
('ORD001','SUP001', 'EMP001', '2024-05-01', 0, N'Nhập đồ gia dụng đợt 1 (HOU)'),
('ORD002','SUP002', 'EMP002', '2024-05-02', 0, N'Nhập đồ gia dụng đợt 2 (HOU)'),
('ORD003','SUP003', 'EMP003', '2024-05-03', 0, N'Nhập thiết bị điện đợt 1 (ELE)'),
('ORD004','SUP004', 'EMP004', '2024-05-04', 0, N'Nhập thiết bị điện đợt 2 (ELE)'),
('ORD005','SUP005', 'EMP005', '2024-05-05', 0, N'Nhập đồ gia dụng đợt 3 (HOU)'),
('ORD006','SUP006', 'EMP006', '2024-05-06', 0, N'Nhập hàng tạp đợt 1 (MSC)'),
('ORD007','SUP007', 'EMP007', '2024-05-07', 0, N'Nhập đồ gia dụng đợt 4 (HOU)'),
('ORD008','SUP008', 'EMP008', '2024-05-08', 0, N'Nhập hàng tạp đợt 2 (MSC)');

-- 7. InboundOrderDetails (Chi tiết phiếu nhập kho)
INSERT INTO InboundOrderDetails (InboundOrderID, ProductID, WarehouseID, QuantityReceived, UnitPrice, LineTotal)
VALUES
('ORD001', 'HOU001', 'WH001', 800, 700000, 70000000), 
('ORD001', 'HOU002', 'WH001', 600, 300000, 45000000), 
('ORD002', 'HOU003', 'WH001', 600, 180000, 21600000), 
('ORD002', 'HOU001', 'WH001', 800, 700000, 56000000), 
('ORD002', 'HOU002', 'WH001', 800, 300000, 30000000), 
('ORD003', 'ELE001', 'WH001', 800, 1200000, 96000000), 
('ORD003', 'ELE003', 'WH001', 900, 20000, 10000000), 
('ORD004', 'ELE002', 'WH001', 1000, 600000, 120000000), 
('ORD004', 'ELE003', 'WH001', 800, 20000, 8000000), 
('ORD005', 'HOU004', 'WH001', 900, 150000, 13500000), 
('ORD005', 'HOU002', 'WH001', 1500, 180000, 27000000), 
('ORD005', 'MSC001', 'WH001', 1000, 30000, 9000000), 
('ORD006', 'MSC001', 'WH001', 1200, 30000, 7500000), 
('ORD007', 'HOU001', 'WH001', 1200, 150000, 15000000), 
('ORD007', 'HOU002', 'WH001', 600, 700000, 42000000), 
('ORD008', 'MSC001', 'WH001', 900, 30000, 6000000), 
('ORD008', 'HOU002', 'WH001', 900, 300000, 27000000);


-- 8.Bảng OutboundOrders: dữ liệu mẫu (8 phiếu xuất kho)
INSERT INTO OutboundOrders (OutboundOrderID, CustomerID, EmployeeID, DispatchDate, TotalAmount, Notes)
VALUES
('ORD001', 'CUST001', 'EMP002', '2024-06-01', 0, N'Xuất đơn gia dụng đợt 1'),
('ORD002', 'CUST002', 'EMP003', '2024-06-02', 0, N'Xuất đơn điện tử đợt 1'),
('ORD003', 'CUST003', 'EMP002', '2024-06-03', 0, N'Xuất đơn gia dụng đợt 2'),
('ORD004', 'CUST004', 'EMP003', '2024-06-04', 0, N'Xuất đơn điện tử đợt 2'),
('ORD005', 'CUST005', 'EMP001', '2024-06-05', 0, N'Xuất đơn điện đợt 3'),
('ORD006', 'CUST006', 'EMP006', '2024-06-06', 0, N'Xuất đơn gia dụng đợt 3'),
('ORD007', 'CUST007', 'EMP008', '2024-06-07', 0, N'Xuất đơn hàng tạp đợt 1'),
('ORD008', 'CUST008', 'EMP008', '2024-06-08', 0, N'Xuất đơn tổng hợp');

-- 9. Chi tiết phiếu xuất kho (OutboundOrderDetails)
INSERT INTO OutboundOrderDetails (OutboundOrderID, ProductID, WarehouseID, UnitPrice, QuantityDispatched, LineTotal)
VALUES
('ORD001', 'HOU001', 'WH001', 950000, 50, 47500000),
('ORD001', 'HOU002', 'WH001', 420000, 70, 29400000),
('ORD002', 'ELE001', 'WH001', 1500000, 30, 45000000),
('ORD002', 'ELE002', 'WH001', 35000, 200, 7000000),
('ORD003', 'HOU001', 'WH001', 250000, 40, 10000000),
('ORD003', 'HOU003', 'WH001', 950000, 20, 19000000),
('ORD004', 'ELE001', 'WH001', 850000, 60, 51000000),
('ORD004', 'ELE003', 'WH001', 35000, 150, 5250000),
('ORD005', 'HOU002', 'WH001', 250000, 70, 17500000),
('ORD005', 'HOU003', 'WH001', 230000, 80, 18400000),
('ORD006', 'HOU004', 'WH001', 230000, 60, 13800000),
('ORD006', 'MSC001', 'WH001', 50000, 100, 5000000),
('ORD007', 'MSC001', 'WH001', 50000, 120, 6000000),
('ORD007', 'HOU001', 'WH001', 950000, 30, 28500000),
('ORD008', 'HOU002', 'WH001', 420000, 40, 16800000),
('ORD008', 'ELE003', 'WH001', 35000, 50, 1750000);


SELECT * FROM Suppliers;
SELECT * FROM ProductCategories;
SELECT * FROM Warehouses;
SELECT * FROM Customers;
SELECT * FROM Employees;
SELECT * FROM Products;
SELECT * FROM InboundOrders;
SELECT * FROM OutboundOrders;
SELECT * FROM InboundOrderDetails;
SELECT * FROM OutboundOrderDetails;
SELECT * FROM Inventory;


