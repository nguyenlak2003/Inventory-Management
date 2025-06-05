const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Customers WHERE IsActive = 1');
        
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi khi truy vấn danh sách khách hàng:", err.message, err.stack);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách khách hàng." });
    }
})

// endpoint xóa nhà cung cấp
router.put('/:ID/deActive', async (req, res) => {
    const { ID } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID', sql.VarChar, ID)
            .query('UPDATE Customers SET IsActive = 0 WHERE CustomerID = @ID');

        if(result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } else {
            res.status(404).json({ message: `Không tìm thấy khách hàng có ID ${ID}` });
        }
    }
    catch (err) {
        console.error(`Lỗi khi cập nhật trạng thái khách hàng ${ID}:`, err.message);
        res.status(500).json({ message: `Lỗi server khi cập nhật trạng thái khách hàng ${ID}.` });
    }
})

// endpoint cập nhật thông tin nhà cung cấp
router.put('/:ID', async (req, res) => {
    const { ID } = req.params;
    const { CustomerName, PhoneNumber, Addr, Email } = req.body;

    console.log({ CustomerName, PhoneNumber, Addr, Email });

    if(!CustomerName || !PhoneNumber || !Addr || !Email) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết để cập nhật khách hàng." });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ID', sql.VarChar, ID)
            .input('CustomerName', sql.NVarChar, CustomerName)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .input('Addr', sql.NVarChar, Addr)
            .input('Email', sql.VarChar, Email)
            .query(`UPDATE Customers
            SET CustomerName = @CustomerName,
                PhoneNumber = @PhoneNumber,
                Addr = @Addr,
                Email = @Email
            WHERE CustomerID = @ID`);
        res.json({ message: 'Khách hàng đã được cập nhật thành công.' });

    } catch (err) {
        console.error("Lỗi khi cập nhật khách hàng:", err.message);
        res.status(500).json({ message: "Lỗi server khi cập nhật khách hàng." });
    }
})

// endpoint thêm mới nhà cung cấp
router.post('/', async (req, res) => {
    const { CustomerID, CustomerName, PhoneNumber, Addr, Email } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CustomerID', sql.VarChar, CustomerID)
            .input('CustomerName', sql.NVarChar, CustomerName)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .input('Addr', sql.NVarChar, Addr)
            .input('Email', sql.VarChar, Email)
            .query(`INSERT INTO Customers (CustomerID, CustomerName, PhoneNumber, Addr, Email)
                    VALUES (@CustomerID, @CustomerName, @PhoneNumber, @Addr, @Email)`);
        
        res.json({ message: 'Khách hàng đã được cập nhật thành công.' });
    } catch (err) {
        console.error("Lỗi khi cập nhật khách hàng:", err.message);
        res.status(500).json({ message: "Lỗi server khi cập nhật khách hàng." });
    }

})

router.get('/next-code', async (req, res) => {
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT TOP 1 CustomerID
                FROM Customers
                ORDER BY CustomerID DESC     
            `);
        
        const prefix = 'CUS';
        var nextCode;
        if (result.recordset.length > 0) {
            const lastCode = result.recordset[0].CustomerID;
            const numericPart = parseInt(lastCode.substring(prefix.length));
            const nextNumericPart = numericPart + 1;
            nextCode = prefix + String(nextNumericPart).padStart(3, '0');
        } else {
            nextCode = prefix + '001';
        }

        res.json({ nextCode });
    } catch (err) {
        console.error(`Lỗi khi tạo khách hàng tiếp theo:`, err.message);
        res.status(500).json({ message: 'Lỗi server khi tạo khách hàng.' });
    }
})

module.exports = router;