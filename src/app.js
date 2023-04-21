const express = require('express'); // express 불러오기
const app = express(); // express 실행
const userRouter = require('./routes/userRouter'); // user 라우터 불러오기
const orderRouter = require('./routes/orderRouter'); // order 라우터 불러오기
const cookieParser = require('cookie-parser'); // 쿠키 파서 불러오기
const cors = require('cors'); // CORS 미들웨어 불러오기
const errorHandler = require('./middlewares/error-handler'); // 에러 핸들러 불러오기

// JSON 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.json());

// URL-encoded 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: false }));

// 쿠키 파서 미들웨어 실행
app.use(cookieParser());

// CORS 오류 방지 미들웨어 실행
app.use(cors());

// user 라우터 사용
app.use('/api/users', userRouter);

// order 라우터 사용
app.use('/api/orders', orderRouter);

// 에러 핸들러 사용
app.use(errorHandler);

// app 객체 모듈로 내보내기
module.exports = app;