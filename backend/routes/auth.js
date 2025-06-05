const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
const sql = require('mssql');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;
    
    console.time('Query time');
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT username, password, Role FROM Employee WHERE username = @username');
    console.timeEnd('Query time');

    const user = result.recordset[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

      console.log('user', user, hashedPassword);
    var isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    const token = jwt.sign(
      {username: user.username, role: user.Role},
      JWT_SECRET,
      {expiresIn: '5h'}
    );
    
    res.json({ message: 'Đăng nhập thành công', token, user: { username: user.username } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Middleware để xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ Bearer

  if (!token) {
    return res.status(401).json({ message: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

// Route kiểm tra trạng thái đăng nhập
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', req.user.username)
      .query('SELECT username FROM Employee WHERE username = @username');

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Lỗi lấy thông tin người dùng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route đổi mật khẩu
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { username } = req.user;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }

  try {
    const pool = await poolPromise;
    const userResult = await pool.request()
                            .input('username', sql.VarChar, username)
                            .query('SELECT password FROM Employee WHERE username = @username');
    
    const user = userResult.recordset[0];


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('newPassword', sql.VarChar, hashedNewPassword)
      .query('UPDATE Employee SET password = @newPassword WHERE username = @username');

    console.log(`Password for user ${username} updated successfully.`);
    res.json({ message: 'Password updated successfully.' });
    
  } catch (error) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error during password change.' });
  }
})

module.exports = router;