const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

// GET /api/inbound-details/:inboundOrderID
router.get('/:inboundOrderID', async (req, res) => {
    const { inboundOrderID } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('InboundOrderID', sql.VarChar, inboundOrderID)
            .query(`
                SELECT InboundOrderID, ProductID, WarehouseID, QuantityReceived, UnitPrice, LineTotal
                FROM InboundOrderDetails
                WHERE InboundOrderID = @InboundOrderID
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching inbound order details:", err);
        res.status(500).json({ message: 'Server error fetching inbound order details.' });
    }
});

// POST /api/inbound-details
router.post('/', async (req, res) => {
    const { InboundOrderID, Items } = req.body;
    if (!InboundOrderID || !Array.isArray(Items) || Items.length === 0) {
        return res.status(400).json({ message: 'Missing InboundOrderID or Items.' });
    }
    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction);
        for (const item of Items) {
            await request
                .input('InboundOrderID', sql.VarChar, InboundOrderID)
                .input('ProductID', sql.VarChar, item.ProductID)
                .input('WarehouseID', sql.VarChar, item.WarehouseID)
                .input('QuantityReceived', sql.Int, item.QuantityReceived)
                .input('UnitPrice', sql.Decimal(18, 2), item.UnitPrice)
                .input('LineTotal', sql.Decimal(18, 2), item.LineTotal)
                .query(`
                    INSERT INTO InboundOrderDetails (InboundOrderID, ProductID, WarehouseID, QuantityReceived, UnitPrice, LineTotal)
                    VALUES (@InboundOrderID, @ProductID, @WarehouseID, @QuantityReceived, @UnitPrice, @LineTotal)
                `);
            request.parameters = {}; // Reset parameters for next iteration
        }

        await transaction.commit();
        console.log("Inbound order details added successfully.");
        res.status(201).json({ message: 'Inbound order details added.' });
    } catch (err) {
        console.error("Error adding inbound order details:", err);
        res.status(500).json({ message: 'Server error adding inbound order details.' });
    }
});

module.exports = router;