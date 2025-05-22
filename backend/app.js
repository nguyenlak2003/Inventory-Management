const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Backend chạy tại http://localhost:${PORT}`));
