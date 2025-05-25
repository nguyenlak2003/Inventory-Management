const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');
const { isAdmin } = require('../tools/adminMiddleware');

router.use(authenticateToken);

router.get('/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    const userRole = req.user.role;

    try {
        const pool = await poolPromise;
        var query = `
                SELECT 
                    Products.ProductID,
                    Products.CategoryID,
                    ProductName,
                    Description,
                    UnitOfMeasure,
                    ImportPrice,
                    SellingPrice,
                    CategoryName,
                    SupplierName,
                    COALESCE(SUM(Quantity), 0) AS Quantity,
                    IsActive
                FROM Products
                JOIN ProductCategories ON Products.CategoryID  = ProductCategories.CategoryID
                LEFT JOIN Suppliers ON Products.SupplierID = Suppliers.SupplierID
                LEFT JOIN Inventory ON Products.ProductID = Inventory.ProductID
                WHERE ProductCategories.CategoryName  = @CategoryName AND IsActive = 1
                GROUP BY
                    Products.ProductID,
                    Products.CategoryID, 
                    ProductName, 
                    Description, 
                    UnitOfMeasure, 
                    ImportPrice, 
                    SellingPrice,
                    CategoryName,
                    SupplierName, 
                    IsActive`;

        if (userRole !== 'admin') {
            query += ' HAVING COALESCE(SUM(Inventory.Quantity), 0) > 0';
        }

        const request = pool.request();
        request.input('CategoryName', sql.NVarChar, categoryName);
        
        const result = await request.query(query);

        res.json(result.recordset);

    } catch (err) {
        console.error(`Lỗi khi truy vấn dữ liệu cho category '${categoryName}':`, err.message);
        res.status(500).json({ message: `Lỗi server khi lấy dữ liệu cho category ${categoryName}.` });
    }
})

router.put('/items/:productID/deActive', isAdmin, async (req, res) => {
    const { productID } = req.params;

    if(!productID) {
        return res.status(400).json({ message: 'Thiếu productID' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProductID', sql.VarChar, productID)
            .query(`UPDATE Products SET IsActive = 0 WHERE ProductID = @ProductID`);
        
        if(result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } else {
            res.status(404).json({ message: `Không tìm thấy sản phẩm có ID ${productID}` });
        }
    } catch (err) {
        console.error(`Lỗi khi cập nhật trạng thái sản phẩm ${productID}:`, err.message);
        res.status(500).json({ message: `Lỗi server khi cập nhật trạng thái sản phẩm ${productID}.` });
    }
})

router.put('/items/:productID', async (req, res) => {
    const { productID } = req.params;
    const {
        name,
        quantity,
        sellPrice,
        buyPrice,
        description,
        unit
    } = req.body;

    if(!name || quantity == null || sellPrice == null || buyPrice == null) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }

    var transaction;
    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const productUpdateRequest = new sql.Request(transaction);
        productUpdateRequest.input('ProductID', sql.VarChar, productID);
        productUpdateRequest.input('ProductName', sql.NVarChar, name);
        productUpdateRequest.input('ImportPrice', sql.Decimal(18, 2), buyPrice);
        productUpdateRequest.input('SellingPrice', sql.Decimal(18, 2), sellPrice);
        if (description !== undefined) productUpdateRequest.input('Decs', sql.NVarChar, description);
        if (unit !== undefined) productUpdateRequest.input('UnitOfMeasure', sql.NVarChar, unit);

        var productUpdateQuery = `UPDATE Products SET
            ProductName = @ProductName,
            ImportPrice = @ImportPrice,
            SellingPrice = @SellingPrice`;
        if (description !== undefined) productUpdateQuery += `, Description = @Decs`;
        if (unit !== undefined) productUpdateQuery += `, UnitOfMeasure = @UnitOfMeasure`;
        productUpdateQuery += ` WHERE ProductID = @ProductID`;

        const productResult = await productUpdateRequest.query(productUpdateQuery);

        if(productResult.rowsAffected[0] === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID ${productID} để cập nhật.` });
        }

        const defaultWarehouseID = 'WH001'; 

        const inventoryUpdateRequest = new sql.Request(transaction);
        inventoryUpdateRequest.input('ProductID', sql.VarChar, productID);
        inventoryUpdateRequest.input('WarehouseID', sql.VarChar, defaultWarehouseID);
        inventoryUpdateRequest.input('Quantity', sql.Int, parseInt(quantity));

        const inventoryUpdateResult = await inventoryUpdateRequest.query(`
            UPDATE Inventory SET Quantity = @Quantity
            WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID
        `);

        await transaction.commit();

        const updatedProductResult = await pool.request()
            .input('ProductID', sql.VarChar, productID)
            .query(`
                SELECT 
                    Products.ProductID,
                    ProductName,
                    Description,
                    UnitOfMeasure,
                    ImportPrice,
                    SellingPrice,
                    CategoryName,
                    SupplierName,
                    COALESCE(SUM(Quantity), 0) AS Quantity,
                    IsActive
                FROM Products
                JOIN ProductCategories ON Products.CategoryID  = ProductCategories.CategoryID
                JOIN Suppliers ON Products.SupplierID = Suppliers.SupplierID
                LEFT JOIN Inventory ON Products.ProductID = Inventory.ProductID
                WHERE Products.ProductID  = @ProductID AND IsActive = 1
                GROUP BY
                    Products.ProductID, 
                    ProductName, 
                    Description, 
                    UnitOfMeasure, 
                    ImportPrice, 
                    SellingPrice,
                    CategoryName,
                    SupplierName, 
                    IsActive
            `);

        if (updatedProductResult.recordset.length > 0) {
            res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công.', item: updatedProductResult.recordset[0] });
        } else {
            res.status(200).json({ message: 'Sản phẩm đã được cập nhật (nhưng không thể lấy lại thông tin mới - có thể đã bị deactivate đồng thời?).'});
        }

    } catch (err) {
        if (transaction && transaction._aborted === false && transaction._committed === false) { // Kiểm tra trạng thái transaction
            try {
                await transaction.rollback();
                console.log("Transaction rolled back due to error.");
            } catch (rollBackErr) {
                console.error('Lỗi khi rollback transaction:', rollBackErr);
            }
        }
        console.error(`Lỗi khi cập nhật sản phẩm ID ${productID}:`, err.message);
        res.status(500).json({ message: `Lỗi server khi cập nhật sản phẩm ${productID}.` });
    }
})

router.get('/next-code/:categoryID', async (req, res) => {
    const { categoryID } = req.params;

    if (!categoryID) {
        return res.status(400).json({ message: 'Thiếu CategoryID' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CategoryID', sql.VarChar, categoryID)
            .query(`
                SELECT TOP 1 ProductID 
                FROM Products 
                WHERE CategoryID = @CategoryID 
                ORDER BY ProductID DESC
            `);

        var nextCode;
        if (result.recordset.length > 0) {
            const lastCode = result.recordset[0].ProductID;
            const numericPart = parseInt(lastCode.substring(categoryID.length));
            const nextNumericPart = numericPart + 1;
            nextCode = categoryID + String(nextNumericPart).padStart(3, '0');
        } else {
            nextCode = categoryID + '001';
        }

        res.json({ nextCode });

    } catch (err) {
        console.error(`Lỗi khi tạo mã sản phẩm tiếp theo cho CategoryID '${categoryID}':`, err.message);
        res.status(500).json({ message: 'Lỗi server khi tạo mã sản phẩm.' });
    }
})

router.get('/check-productid/:productID', async (req, res) => {
    const { productID } = req.params;

    if(!productID) {
        return res.status(400).json({ message: 'Thiếu productID' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProductID', sql.VarChar, productID)
            .query(`SELECT ProductID FROM Products WHERE ProductID = @ProductID`);

            if(result.recordset.length > 0) {
                res.json({ exists: true, message: 'Mã sản phẩm đã tồn tại.'});
            } else {
                res.json({ exists: false, message: '' });
            }
    } catch (err) {
        console.error(`Lỗi khi kiểm tra ProductID '${productID}':`, err.message);
        res.status(500).json({ exists: false, message: 'Lỗi server khi kiểm tra mã sản phẩm.' });
    }
})

router.post('/items', isAdmin, async (req, res) => {
    const {
        code,
        name, 
        sellPrice,
        buyPrice,
        description,
        unit,
        categoryID
    } = req.body;

    if(!code || !name || unit == null || sellPrice == null || buyPrice == null || !categoryID) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (Mã SP, Tên SP, Giá bán, Giá mua, Tên loại SP).' });
    }

    var transaction;
    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const defaultWarehouseID = 'WH001'; // ID kho mặc định

        const productInsertRequest = new sql.Request(transaction); 
        productInsertRequest.input('ProductID', sql.VarChar, code);
        productInsertRequest.input('ProductName', sql.NVarChar, name);
        productInsertRequest.input('CategoryID', sql.VarChar, categoryID);
        productInsertRequest.input('ImportPrice', sql.Decimal(18, 2), buyPrice);
        productInsertRequest.input('SellingPrice', sql.Decimal(18, 2), sellPrice);
        productInsertRequest.input('UnitOfMeasure', sql.NVarChar, unit);
        productInsertRequest.input('Description', sql.NVarChar, description);
        
        let productInsertQuery = `
            INSERT INTO Products (ProductID, ProductName, CategoryID, ImportPrice, SellingPrice, UnitOfMeasure, Description)
            VALUES (@ProductID, @ProductName, @CategoryID, @ImportPrice, @SellingPrice, @UnitOfMeasure, @Description)
        `;
        await productInsertRequest.query(productInsertQuery);


        const inventoryInsertRequest = new sql.Request(transaction);
        inventoryInsertRequest.input('ProductID', sql.VarChar, code);
        inventoryInsertRequest.input('WarehouseID', sql.VarChar, defaultWarehouseID);
        inventoryInsertRequest.input('Quantity', sql.Int, 0); // Số lượng ban đầu là 0

        await inventoryInsertRequest.query(`
            INSERT INTO Inventory (ProductID, WarehouseID, Quantity)
            VALUES (@ProductID, @WarehouseID, @Quantity)
        `);

        await transaction.commit();

        const newProductResult = await pool.request()
            .input('ProductID', sql.VarChar, code)
            .query(`
                SELECT 
                    Products.ProductID, 
                    Products.CategoryID, 
                    ProductName, 
                    Description, 
                    UnitOfMeasure,
                    ImportPrice, 
                    SellingPrice, 
                    CategoryName, 
                    COALESCE(i.Quantity, 0) AS Quantity, 
                    IsActive
                FROM Products
                JOIN ProductCategories ON Products.CategoryID  = ProductCategories.CategoryID
                LEFT JOIN Inventory i ON Products.ProductID = i.ProductID
                WHERE Products.ProductID  = @ProductID
            `);

        if (newProductResult.recordset.length > 0) {
             res.status(201).json({ message: 'Sản phẩm đã được tạo thành công.', item: newProductResult.recordset[0] });
        } else {
            throw new Error("Không thể truy xuất sản phẩm vừa tạo.");
        }

    } catch (err) {
        if (transaction && transaction._aborted === false && transaction._committed === false) {
            try {
                await transaction.rollback();
            } catch (rollBackErr) {
                console.error('Lỗi khi rollback transaction:', rollBackErr);
            }
        }
        
        // Gửi thông báo lỗi cụ thể nếu là lỗi trùng mã
        if (err.number === 2627 || err.message.includes('PRIMARY KEY')) {
            return res.status(409).json({ message: `Mã sản phẩm '${code}' đã tồn tại.` });
        }

        console.error(`Lỗi khi tạo sản phẩm mới:`, err.message);
        res.status(500).json({ message: `Lỗi server khi tạo sản phẩm mới.` });
    }
})


module.exports = router;    