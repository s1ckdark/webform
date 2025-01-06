const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'agree_db'
});

// 데이터베이스 연결
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // users 테이블 생성
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    connection.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Users table created or already exists');
    });
});

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 폼 제출 처리
app.post('/submit', (req, res) => {
    const { name, email, phone } = req.body;
    
    const query = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
    connection.query(query, [name, email, phone], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('데이터 저장 중 오류가 발생했습니다.');
            return;
        }
        res.send('회원가입이 완료되었습니다!');
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});