require('dotenv').config(); // dotenv 모듈 config
const { PORT } = process.env; // .env 파일에서 PORT 가져오기
const port = PORT || 4000; // .env에 포트가 선언되지 않았을시 4000번 포트 사용
const app = require('./src/app'); // './src/app' 경로에서 app 객체 불러오기
const db = require('./src/db'); // './src/db' 경로에서 db 객체 불러오기 (db를 실행하기 위함)

app.get('/', (req, res) => {
    res.send('TEST PAGE');
});

app.listen(port, () => {
    console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${port}`);
}); // 서버 실행