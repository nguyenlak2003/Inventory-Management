const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { poolPromise, sql } = require('../db');
const { authenticateToken } = require('../tools/authMiddleware');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT 
                Employees.EmployeeID,
                EmployeeName,
                DateOfBirth,
                Gender,
                Addr,
                Email,
                PhoneNumber,
                username,
                Role
            FROM Employees 
            JOIN Employee 
                ON Employees.EmployeeID = Employee.EmployeeID
            WHERE Employee.IsActive = 1`);
        
        res.json(result.recordset);

    } catch (err) {
        console.error(`Lỗi khi truy vấn dữ liệu nhân viên: `, err.message);
        res.status(500).json({ message: `Lỗi server khi lấy dữ liệu nhân viên.` });
    }
})

router.put('/:employeeID/deActive', async (req, res) => {
    const { employeeID } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('employeeID', sql.VarChar, employeeID)
            .query(`UPDATE Employee
                    SET IsActive = 0
                    WHERE EmployeeID = @employeeID`);
        
        if(result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } else {
            res.status(404).json({ message: `Không tìm thấy nhân viên có ID ${employeeID}` });
        }
    } catch (err) {
        console.error(`Lỗi khi cập nhật trạng thái nhân viên ${employeeID}:`, err.message);
        res.status(500).json({ message: `Lỗi server khi cập nhật trạng thái nhân viên ${employeeID}.` });
    }
})

router.put('/:id', async (req, res) => {
    const employeeID  = req.params.id;
    const { EmployeeName, DateOfBirth, Gender, Addr, Email,
             PhoneNumber, Username, Password } = req.body;
    
    try {
        const pool = await poolPromise;

        await pool.request()
            .input('EmployeeID', sql.VarChar, employeeID)
            .input('EmployeeName', sql.NVarChar, EmployeeName)
            .input('DateOfBirth', sql.Date, DateOfBirth)
            .input('Gender', sql.NVarChar, Gender)
            .input('Addr', sql.NVarChar, Addr)
            .input('Email', sql.VarChar, Email)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .query(`UPDATE Employees
                    SET EmployeeName = @EmployeeName,
                        DateOfBirth = @DateOfBirth,
                        Gender = @Gender,
                        Addr = @Addr,
                        Email = @Email,
                        PhoneNumber = @PhoneNumber
                    WHERE EmployeeID = @EmployeeID`);

         if (Password && Password.trim() !== "") {
            // Nếu có nhập mật khẩu mới thì hash và update
            const hashedPassword = await bcrypt.hash(Password, 10);
            await pool.request()
                .input('EmployeeID', sql.VarChar, employeeID)
                .input('Username', sql.VarChar, Username)
                .input('Password', sql.VarChar, hashedPassword)
                .query(`UPDATE Employee
                        SET Username = @Username,
                            Password = @Password
                        WHERE EmployeeID = @EmployeeID`);
        } else {
            // Không nhập mật khẩu mới, chỉ update Username
            await pool.request()
                .input('EmployeeID', sql.VarChar, employeeID)
                .input('Username', sql.VarChar, Username)
                .query(`UPDATE Employee
                        SET Username = @Username
                        WHERE EmployeeID = @EmployeeID`);
        }
        
        res.json({ message: 'Cập nhật thành công' });

    } catch (err) {
        console.error("Lỗi không cập nhật được nhân viên :", err.message);
        res.status(500).json({ message: 'Lỗi server khi cập nhật.' });
    }
})

router.post('/', async (req, res) => {
    const { 
        EmployeeID, EmployeeName, DateOfBirth, Gender, Addr, Email, 
        PhoneNumber, Username, Password, Role
    } = req.body;

    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(Password, 10);

        await pool.request()
            .input('EmployeeID', sql.VarChar, EmployeeID)
            .input('EmployeeName', sql.NVarChar, EmployeeName)
            .input('DateOfBirth', sql.Date, DateOfBirth)
            .input('Gender', sql.NVarChar, Gender)
            .input('Addr', sql.NVarChar, Addr)
            .input('Email', sql.VarChar, Email)
            .input('PhoneNumber', sql.VarChar, PhoneNumber)
            .query(`INSERT INTO Employees 
                (EmployeeID, EmployeeName, DateOfBirth, Gender, Addr, Email, PhoneNumber)
                VALUES (@EmployeeID, @EmployeeName, @DateOfBirth, @Gender, @Addr, @Email, @PhoneNumber)`);
            
        await pool.request()
            .input('EmployeeID', sql.VarChar, EmployeeID)
            .input('username', sql.VarChar, Username)
            .input('password', sql.VarChar, hashedPassword)
            .input('Role', sql.VarChar, Role)
            .query(`INSERT INTO Employee 
                (EmployeeID, username, password, Role)
                VALUES (@EmployeeID, @Username, @Password, @Role)`);
        
        res.json({ message: 'Thêm nhân viên thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi thêm nhân viên.' });
    }

})

router.get('/next-code', async (req, res) => {
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT TOP 1 EmployeeID
                FROM Employees
                ORDER BY EmployeeID DESC     
            `);
        
        const prefix = 'EMP';
        var nextCode;
        if (result.recordset.length > 0) {
            const lastCode = result.recordset[0].EmployeeID;
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

router.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;
    const { excludeEmployeeID } = req.query; // Tùy chọn: ví dụ EMP001
    //console.log(username);

    try {
        const pool = await poolPromise;
        let query = `SELECT COUNT(*) as count FROM Employee WHERE username = @username COLLATE Latin1_General_CS_AS`; // Thêm COLLATE để phân biệt chữ hoa/thường
        const request = pool.request().input('username', sql.VarChar, username);

        if (excludeEmployeeID) {
            query += ` AND EmployeeID != @excludeEmployeeID`;
            request.input('excludeEmployeeID', sql.VarChar, excludeEmployeeID);
        }

        const result = await request.query(query);
        const exists = result.recordset[0].count > 0;
        //console.log(`Username ${username} exists:`, exists);
        res.json({ exists }); // Trả về { exists: true } nếu tồn tại, ngược lại { exists: false }

    } catch (err) {
        console.error('Lỗi khi kiểm tra username:', err.message);
        res.status(500).json({ message: 'Lỗi server khi kiểm tra username.' });
    }
});

module.exports = router;
