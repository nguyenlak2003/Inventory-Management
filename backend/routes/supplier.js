const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    console.log("GET /api/supplier called");
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Suppliers WHERE IsActive = 1');
        
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi khi truy vấn danh sách nhà cung cấp:", err.message, err.stack);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách nhà cung cấp." });
    }
})

// endpoint xóa nhà cung cấp
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

// endpoint cập nhật thông tin nhà cung cấp
router.put('/:ID', async (req, res) => {
    const { ID } = req.params;
    const { SupplierName, PhoneNumber, Addr, Email } = req.body;

    if(!SupplierName || !PhoneNumber || !Addr || !Email) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết để cập nhật nhà cung cấp." });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ID', sql.VarChar, ID)
            .input('SupplierName', sql.NVarChar, SupplierName)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .input('Addr', sql.NVarChar, Addr)
            .input('Email', sql.VarChar, Email)
            .query(`UPDATE Suppliers
            SET SupplierName = @SupplierName,
                PhoneNumber = @PhoneNumber,
                Addr = @Addr,
                Email = @Email
            WHERE SupplierID = @ID`);
        
        res.json({ message: 'Nhà cung cấp đã được cập nhật thành công.' });

    } catch (err) {
        console.error("Lỗi khi cập nhật nhà cung cấp:", err.message);
        res.status(500).json({ message: "Lỗi server khi cập nhật nhà cung cấp." });
    }
})

// endpoint thêm mới nhà cung cấp
router.post('/', async (req, res) => {
    const { SupplierID, SupplierName, PhoneNumber, Addr, Email } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('SupplierID', sql.VarChar, SupplierID)
            .input('SupplierName', sql.NVarChar, SupplierName)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .input('Addr', sql.NVarChar, Addr)
            .input('Email', sql.VarChar, Email)
            .query(`INSERT INTO Suppliers (SupplierID, SupplierName, PhoneNumber, Addr, Email)
                    VALUES (@SupplierID, @SupplierName, @PhoneNumber, @Addr, @Email)`);
        
        res.json({ message: 'Nhà cung cấp đã được cập nhật thành công.' });
    } catch (err) {
        console.error("Lỗi khi cập nhật nhà cung cấp:", err.message);
        res.status(500).json({ message: "Lỗi server khi cập nhật nhà cung cấp." });
    }

})

router.get('/next-code', async (req, res) => {
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT TOP 1 SupplierID
                FROM Suppliers
                ORDER BY SupplierID DESC     
            `);
        
        const prefix = 'SUP';
        var nextCode;
        if (result.recordset.length > 0) {
            const lastCode = result.recordset[0].SupplierID;
            const numericPart = parseInt(lastCode.substring(prefix.length));
            const nextNumericPart = numericPart + 1;
            nextCode = prefix + String(nextNumericPart).padStart(3, '0');
        } else {
            nextCode = prefix + '001';
        }

        res.json({ nextCode });
    } catch (err) {
        console.error(`Lỗi khi tạo nhà cung cấp tiếp theo:`, err.message);
        res.status(500).json({ message: 'Lỗi server khi tạo nhà cung cấp.' });
    }
})

module.exports = router;