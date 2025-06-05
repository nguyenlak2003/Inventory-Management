const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

// Get all active outbound orders
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT OutboundOrderID, CustomerID, DispatchDate, TotalAmount, Notes
            FROM OutboundOrders
            WHERE IsActive = 1
            ORDER BY DispatchDate DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in /api/outbound:", err);
        res.status(500).json({ message: 'Fetch error.' });
    }
});

// Get a specific outbound order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OutboundOrderID', sql.VarChar, id)
            .query(`
                SELECT OutboundOrderID, CustomerID, DispatchDate, TotalAmount, Notes
                FROM OutboundOrders
                WHERE OutboundOrderID = @OutboundOrderID AND IsActive = 1
            `);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Fetch error.' });
    }
});

// Add a new outbound order
router.post('/', async (req, res) => {
    const { CustomerID, DispatchDate, TotalAmount, Notes, OutboundOrderID } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OutboundOrderID', sql.VarChar, OutboundOrderID) // Can be undefined for default
            .input('CustomerID', sql.VarChar, CustomerID)
            .input('DispatchDate', sql.DateTime, DispatchDate)
            .input('TotalAmount', sql.Decimal(18, 2), TotalAmount)
            .input('Notes', sql.NVarChar, Notes)
            .query(`
                INSERT INTO OutboundOrders (OutboundOrderID, CustomerID, DispatchDate, TotalAmount, Notes)
                OUTPUT inserted.OutboundOrderID
                VALUES (
                   @OutboundOrderID,
                    @CustomerID, 
                    @DispatchDate, 
                    @TotalAmount, 
                    @Notes
                )
            `);
        res.status(201).json({ message: 'Outbound order created.', OutboundOrderID: result.recordset[0].OutboundOrderID });
    } catch (err) {
        console.error('Error creating outbound order:', err);
        res.status(500).json({ message: 'Server error creating outbound order.' });
    }
});

// Soft-delete (deactivate) an outbound order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OutboundOrderID', sql.VarChar, id)
            .query(`
                UPDATE OutboundOrders SET IsActive = 0 WHERE OutboundOrderID = @OutboundOrderID
            `);
        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Outbound order removed.' });
        } else {
            res.status(404).json({ message: 'Outbound order not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error removing outbound order.' });
    }
});

module.exports = router;