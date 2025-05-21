USE inventory;
GO

--1. NhaCungCap (Suppliers)
CREATE TABLE Suppliers (
    SupplierID VARCHAR(50) PRIMARY KEY,
    SupplierName NVARCHAR(255),
    Addr NVARCHAR(255),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255)
);
GO

--2. Loại Sản Phẩm (Product Categories)
CREATE TABLE ProductCategories (
    CategoryID VARCHAR(50) PRIMARY KEY,
    CategoryName NVARCHAR(255) NOT NULL -- Assuming a CategoryName column is needed
    -- Add other relevant columns for product categories if necessary
);
GO

--3. Kho (Warehouses)
CREATE TABLE Warehouses (
    WarehouseID VARCHAR(50) PRIMARY KEY,
    WarehouseName NVARCHAR(255),
    Addr NVARCHAR(255)
);
GO

--4. KhachHang (Customers)
CREATE TABLE Customers (
    CustomerID VARCHAR(50) PRIMARY KEY,
    CustomerName NVARCHAR(255),
    Addr NVARCHAR(255),
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20)
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
    Decs NVARCHAR(MAX), -- 'Decs' likely means 'Description'
    UnitOfMeasure NVARCHAR(50),
    ImportPrice DECIMAL(18, 2),
    SellingPrice DECIMAL(18, 2),
    SupplierID VARCHAR(50),
    CategoryID VARCHAR(50),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (CategoryID) REFERENCES ProductCategories(CategoryID)
);
GO

--7. Phiếu Nhập Kho (Inbound Orders / Goods Receipts)
CREATE TABLE InboundOrders (
    InboundOrderID VARCHAR(50) PRIMARY KEY,
    SupplierID VARCHAR(50),
    EmployeeID VARCHAR(50),
    DateOfReceipt DATETIME,
    TotalAmount DECIMAL(18, 2),
    Notes NVARCHAR(MAX),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);
GO

--8. Phiếu Xuất Kho (Outbound Orders / Goods Issues)
CREATE TABLE OutboundOrders (
    OutboundOrderID VARCHAR(50) PRIMARY KEY,
    CustomerID VARCHAR(50),
    EmployeeID VARCHAR(50),
    DispatchDate DATETIME,
    TotalAmount DECIMAL(18, 2),
    Notes NVARCHAR(MAX),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);
GO

--9. Chi Tiết Phiếu Nhập Kho (Inbound Order Details)
CREATE TABLE InboundOrderDetails (
    InboundDetailID INT PRIMARY KEY IDENTITY(1,1),
    InboundOrderID VARCHAR(50),
    ProductID VARCHAR(50),
    WarehouseID VARCHAR(50),
    QuantityReceived INT,
    UnitPrice DECIMAL(18, 2),
    LineTotal DECIMAL(18, 2),
    FOREIGN KEY (InboundOrderID) REFERENCES InboundOrders(InboundOrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID)
);
GO

--10. Chi Tiết Phiếu Xuất Kho (Outbound Order Details)
CREATE TABLE OutboundOrderDetails (
    OutboundDetailID INT PRIMARY KEY IDENTITY(1,1),
    OutboundOrderID VARCHAR(50),
    ProductID VARCHAR(50),
    WarehouseID VARCHAR(50),
    UnitPrice DECIMAL(18, 2),
    QuantityDispatched INT,
    LineTotal DECIMAL(18, 2),
    FOREIGN KEY (OutboundOrderID) REFERENCES OutboundOrders(OutboundOrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID) -- Added this missing FK
);
GO

--11. Hàng trong kho (Inventory / StockInWarehouse)
CREATE TABLE Inventory (
    ProductID VARCHAR(50),
    WarehouseID VARCHAR(50),
    Quantity INT,
    PRIMARY KEY (ProductID, WarehouseID), -- Composite primary key
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID)
);
GO
