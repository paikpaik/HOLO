const { Router } = require('express');
const router = Router();
const userService = require('../services/userService'); // 유저 서비스 불러오기
const loginRequired = require('../middlewares/login-required'); // 로그인 확인 미들웨어 불러오기 (로그인이 필요한 기능이 있을시 해당 라우터에 사용됨)

// 회원가입 라우터
router.post('/register', async (req, res) => {
    // 유저 정보 가져옴
    const userInfo = req.body;

    // 정상 처리될 시 가입 응답 전송
    try {
        const newUser = await userService.register(userInfo);
        res.status(201).json({
            message: '회원가입이 완료되었습니다.', user: newUser
        });
        // 문제 발생시 오류 전송
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

// 로그인 라우터
router.post('/login', async (req, res) => {
    try {
        await userService.login(req.body, res);
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

// 로그아웃 라우터
// 쿠키에서 토큰을 제거하는 작업은 동기적인 작업이므로, async 처리 불필요
router.post('/logout', (req, res) => {
    try {
        userService.logout(req, res);
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

// 사용자 정보 조회 라우터
router.get('/user-info', loginRequired, async (req, res) => {
    try {
        const user = await userService.getUserById(req.currentUserId);
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

// 비밀번호 확인 라우터 (회원정보 수정 페이지에서 본인 확인을 위해 입력받은 비밀번호 일치 여부 확인)
router.post('/check-password', loginRequired, async (req, res) => {
    try {
        const { currentPassword } = req.body;
        const isMatched = await userService.isPasswordMatch(req.currentUserId, currentPassword);
        if (isMatched) {
            res.status(200).json({ message: '비밀번호가 일치합니다.' });
        } else {
            res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

// 사용자 정보 수정 라우터
router.patch('/update-user-info', loginRequired, async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.currentUserId, req.body);
        res.json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

// 사용자 정보 삭제 라우터
router.delete('/delete-user-info', loginRequired, async (req, res) => {
    try {
        await userService.deleteUser(req.currentUserId);
        res.json({ message: '회원 탈퇴가 완료되었습니다.' });
    } catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
});

module.exports = router;