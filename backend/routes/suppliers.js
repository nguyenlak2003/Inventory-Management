const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Suppliers');
        console.log(result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi khi truy vấn danh sách nhà cung cấp:", err.message, err.stack);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách nhà cung cấp." });
    }
})

router.put('/:ID/deActive', async (req, res) => {
    const { ID } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID', sql.VarChar, ID)
            .query('UPDATE Suppliers SET IsActive = 0 WHERE SupplierID = @ID');

        if(result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } else {
            res.status(404).json({ message: `Không tìm thấy nhà cung cấp có ID ${ID}` });
        }
    }
    catch (err) {
        console.error(`Lỗi khi cập nhật trạng thái nhà cung cấp ${ID}:`, err.message);
        res.status(500).json({ message: `Lỗi server khi cập nhật trạng thái nhà cung cấp ${ID}.` });
    }
})

module.exports = router;