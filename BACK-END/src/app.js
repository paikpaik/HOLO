const express = require('express'); // express 불러오기
const app = express(); // express 실행
const userRouter = require('./routers/userRouter'); // user 라우터 불러오기
const productRouter = require('./routers/productRouter');
const categoryRouter = require('./routers/categoryRouter');


// JSON 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.json());

// URL-encoded 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: false }));

// user 라우터 사용
app.use('/api/users', userRouter);
// products 라우터 사용
app.use('/api/products', productRouter);
app.use('/', categoryRouter);

// app 객체 모듈로 내보내기
module.exports = app;