const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');
const { pool } = require('mssql');

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
                    COALESCE(SUM(Quantity), 0) AS Quantity
                FROM Products
                JOIN ProductCategories ON Products.CategoryID  = ProductCategories.CategoryID
                JOIN Suppliers ON Products.SupplierID = Suppliers.SupplierID
                LEFT JOIN Inventory ON Products.ProductID = Inventory.ProductID
                WHERE ProductCategories.CategoryName  = @CategoryNameParam
                GROUP BY
                    Products.ProductID, 
                    ProductName, 
                    Description, 
                    UnitOfMeasure, 
                    ImportPrice, 
                    SellingPrice,
                    CategoryName,
                    SupplierName
            `);
            console.log(result.recordset);
            res.json(result.recordset);
    } catch (err) {
        console.error(`Lỗi khi truy vấn dữ liệu cho category '${categoryName}':`, err.message);
        res.status(500).json({ message: `Lỗi server khi lấy dữ liệu cho category ${categoryName}.` });
    }
})



module.exports = router;