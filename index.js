const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// EJS 설정 추가
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB 연결 설정
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas에 연결되었습니다.'))
    .catch(err => console.error('MongoDB 연결 오류:', err));

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    agree: { type: Boolean, required: true },
    transformId: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const email = req.query.email || '';
    res.render('index', { 
        email: email,
        title: '동의 페이지' // EJS 템플릿에서 사용할 추가 데이터
    });
});

// 폼 제출 처리 수정
app.post('/submit', async (req, res) => {
    const { email, transformId } = req.body;
    const agree = req.body.agree === 'on';

    try {
        const user = new User({ email, agree, transformId });
        await user.save();
        res.render('success', { 
            message: '동의가 완료되었습니다!',
            user: user 
        });
    } catch (err) {
        console.error('데이터 저장 오류:', err);
        res.render('error', { 
            error: '데이터 저장 중 오류가 발생했습니다.' 
        });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});