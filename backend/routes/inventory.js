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
            .input('CategoryNameParam', sql.NVarChar, categoryName)
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
                WHERE ProductCategories.CategoryName  = @CategoryNameParam AND IsActive = 1
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

router.put('/items/:productID/deActive', async (req, res) => {
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


module.exports = router;