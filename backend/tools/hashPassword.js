const bcrypt = require('bcryptjs');
const { poolPromise } = require('../db');

async function hashExistingPasswords() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT username, password FROM Employee');

    for (const user of result.recordset) {
      // Kiểm tra xem mật khẩu đã được mã hóa chưa
      if (!user.password.startsWith('$2a$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.request()
          .input('username', user.username)
          .input('password', hashedPassword)
          .query('UPDATE Employee SET password = @password WHERE username = @username');
        console.log(`Đã mã hóa mật khẩu cho ${user.username}`);
      }
    }
    console.log('Hoàn tất mã hóa mật khẩu');
  } catch (err) {
    console.error('Lỗi khi mã hóa mật khẩu:', err);
  }
}

hashExistingPasswords();