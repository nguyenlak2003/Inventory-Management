const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');
const { pool } = require('mssql');
const { isAdmin } = require('../tools/adminMiddleware');

router.use(authenticateToken);

router.get('/:categoryName', async (req, res) => {
    const { categoryName } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CategoryName', sql.NVarChar, categoryName)
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
                WHERE ProductCategories.CategoryName  = @CategoryName AND IsActive = 1
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


module.exports = router;