const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

// GET /api/outbound-details/:outboundOrderID
router.get('/:outboundOrderID', async (req, res) => {
    const { outboundOrderID } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OutboundOrderID', sql.VarChar, outboundOrderID)
            .query(`
                SELECT OutboundDetailID, OutboundOrderID, ProductID, WarehouseID, UnitPrice, QuantityDispatched, LineTotal
                FROM OutboundOrderDetails
                WHERE OutboundOrderID = @OutboundOrderID
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching outbound order details:", err);
        res.status(500).json({ message: 'Server error fetching outbound order details.' });
    }
});

// POST /api/outbound-details
router.post('/', async (req, res) => {
    const { OutboundOrderID, Items } = req.body;
    if (!OutboundOrderID || !Array.isArray(Items) || Items.length === 0) {
        return res.status(400).json({ message: 'Missing OutboundOrderID or Items.' });
    }
    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction);
        for (const item of Items) {
            await request
                .input('OutboundOrderID', sql.VarChar, OutboundOrderID)
                .input('ProductID', sql.VarChar, item.ProductID)
                .input('WarehouseID', sql.VarChar, item.WarehouseID)
                .input('UnitPrice', sql.Decimal(18, 2), item.UnitPrice)
                .input('QuantityDispatched', sql.Int, item.QuantityDispatched)
                .input('LineTotal', sql.Decimal(18, 2), item.LineTotal)
                .query(`
                    INSERT INTO OutboundOrderDetails (OutboundOrderID, ProductID, WarehouseID, UnitPrice, QuantityDispatched, LineTotal)
                    VALUES (@OutboundOrderID, @ProductID, @WarehouseID, @UnitPrice, @QuantityDispatched, @LineTotal)
                `);
            request.parameters = {}; // Reset parameters for next iteration
        }

        await transaction.commit();
        res.status(201).json({ message: 'Outbound order details added.' });
    } catch (err) {
        console.error("Error adding outbound order details:", err);
        res.status(500).json({ message: 'Server error adding outbound order details.' });
    }
});

module.exports = router;