const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

// Get all active inbound orders
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT InboundOrderID, SupplierID, DateOfReceipt, TotalAmount, Notes
            FROM InboundOrders
            WHERE IsActive = 1
            ORDER BY DateOfReceipt DESC
        `);
        console.log(result)
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in /api/inbound:", err);
        res.status(500).json({ message: 'Lỗi fetch.' });
    }
});

// Get a specific inbound order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('InboundOrderID', sql.VarChar, id)
            .query(`
                SELECT InboundOrderID, SupplierID, EmployeeID, DateOfReceipt, TotalAmount, Notes
                FROM InboundOrders
                WHERE InboundOrderID = @InboundOrderID AND IsActive = 1
            `);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy orders.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'SLỗi fetch.' });
    }
});

// Add a new inbound order
router.post('/', async (req, res) => {
    const { SupplierID, DateOfReceipt, TotalAmount, Notes, InboundOrderID } = req.body;
    console.log('POST /api/inbound body:', req.body);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
       
            .input('InboundOrderID', sql.VarChar, InboundOrderID)
            .input('SupplierID', sql.VarChar, SupplierID)
            .input('DateOfReceipt', sql.DateTime, DateOfReceipt)
            .input('TotalAmount', sql.Decimal(18, 2), TotalAmount)
            .input('Notes', sql.NVarChar, Notes)
            .query(`
                INSERT INTO InboundOrders (InboundOrderID, SupplierID, DateOfReceipt, TotalAmount, Notes)
                OUTPUT inserted.InboundOrderID
                VALUES (@InboundOrderID, @SupplierID, @DateOfReceipt, @TotalAmount, @Notes)
            `);
        console.log('Insert result:', result);
        res.status(201).json({ message: 'Inbound order created.', InboundOrderID: result.recordset[0].InboundOrderID });
    } catch (err) {
        console.error('Error creating inbound order:', err);
        res.status(500).json({ message: 'Server error creating inbound order.' });
    }
});

// Soft-delete (deactivate) an inbound order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('InboundOrderID', sql.VarChar, id)
            .query(`
                UPDATE InboundOrders SET IsActive = 0 WHERE InboundOrderID = @InboundOrderID
            `);
        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Inbound order removed.' });
        } else {
            res.status(404).json({ message: 'Inbound order not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error removing inbound order.' });
    }
});

module.exports = router;