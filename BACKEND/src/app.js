const express = require('express'); // express 불러오기
const app = express(); // express 실행
const userRouter = require('./routes/userRouter'); // user 라우터 불러오기
const cartRouter = require("./routes/cartRouter"); // cart 라우터 불러오기
const productRouter = require("./routes/productRouter"); // product 라우터 불러오기
const orderRouter = require('./routes/orderRouter'); // order 라우터 불러오기
const adminRouter = require('./routes/adminRouter'); // admin 라우터 불러오기
const viewsRouter = require('./routes/viewsRouter'); // views 라우터 불러오기
const cookieParser = require('cookie-parser'); // 쿠키 파서 불러
const cors = require('cors'); // CORS 미들웨어 불러오기
const refreshJwtMiddleware = require('./middlewares/refreshToken'); // refreshJwtToken 미들웨어 불러오기
const errorHandler = require('./middlewares/error-handler'); // 에러 핸들러 불러오기

// JSON 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.json());

// URL-encoded 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: false }));

// 쿠키 파서 미들웨어 실행
app.use(cookieParser());

// CORS 오류 방지 미들웨어 실행
app.use(cors());

// refreshJwt 미들웨어 실행
app.use(refreshJwtMiddleware);

// user 라우터 사용
app.use('/api/users', userRouter);

// cart 라우터 사용
app.use('/api/cart', cartRouter);

// product 라우터 사용
app.use('/api/products', productRouter);

// order 라우터 사용
app.use('/api/order', orderRouter);

// admin 라우터 사용
app.use('/api/admin', adminRouter);

// views 라우터 사용
app.use('/', viewsRouter);

// 에러 핸들러 사용
app.use(errorHandler);

// app 객체 모듈로 내보내기
module.exports = app;