const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Backend chạy tại http://localhost:${PORT}`));
