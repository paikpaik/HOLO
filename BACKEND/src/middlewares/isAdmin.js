const userModel = require('../db/models/userModel'); // user 모델 불러오기


// 관리자 여부 확인 미들웨어
async function isAdmin(req, res, next) {
    const user = await userModel.findByUserId(req.currentUserId);

    if (user && user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }
};

module.exports = isAdmin;