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
            .input('TenLoaiSP', sql.NVarChar, categoryName)
            .query(`
                SELECT 
                    sp.MaSP, 
                    sp.TenSP, 
                    sp.MoTa, 
                    sp.DonViTinh, 
                    sp.GiaNhap, 
                    sp.GiaXuat
                FROM SanPham sp
                JOIN LoaiSanPham lsp ON sp.MaLoaiSP = lsp.MaLoaiSP
                WHERE lsp.TenLoaiSP = @TenLoaiSP
            `);

            res.json(result.recordset);
    } catch (err) {
        console.error(`Lỗi khi truy vấn dữ liệu cho category '${categoryName}':`, err.message);
        res.status(500).json({ message: `Lỗi server khi lấy dữ liệu cho category ${categoryName}.` });
    }
})

module.exports = router;