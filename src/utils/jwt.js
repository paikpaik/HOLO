const jwt = require('jsonwebtoken'); // jwt 모듈 불러오기

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}; // jwt.sign() 메서드를 통해 jwt 토큰 발행. expiresIn : '1h' 설정으로 1시간 후 토큰이 만료되게 설정.

module.exports = generateToken;
