const userModel = require('../db/models/userModel'); // user 모델 불러오기
const bcrypt = require('bcrypt'); // 비밀번호 해쉬화를 위한 bcrypt 불러오기
const jwt = require('jsonwebtoken'); // jwt 토큰 사용을 위해 모듈 불러오기
const generateToken = require('../utils/jwt'); // jwt 토큰 생성 파일 불러오기

const saltRounds = 10; // bcrypt에서 사용되는 솔트 라운드 값 설정. 값이 클수록 보안성이 높지만, 처리 속도가 오래걸림.

// 회원가입 로직 구현을 위한 class 생성
class UserService {
    // 이름 검사 함수: 사용자 이름에 숫자나 특수문자가 포함되지 않는지 검사
    isValidName(name) {
        const nameRegex = /^[a-zA-Z가-힣]+$/; // 사용자 이름에 영문과 한글만 허용하는 정규식
        return nameRegex.test(name); // .test() 메서드를 통해 정규식을 검사하여 true 혹은 false 반환
    }

    // 비밀번호 검사 함수: 최소 8자리 이상이며, 특수문자를 포함해야 함
    isValidPassword(password) {
        const minLength = 8; // 비밀번호는 최소 8글자로 설정
        const hasSpecialChar = /[\W]/.test(password); // 비밀번호에 특수문자가 포함되는지 검사하는 정규식
        return password.length >= minLength && hasSpecialChar;
    }

    // 이메일 검사 함수: 올바른 이메일 형식인지 검사
    isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; // 'text@text.com' 형식을 검사하는 정규식
        return emailRegex.test(email);
    }

    // 회원가입 로직
    async register(req, res) {

        // req에서 필요한 정보 받아옴
        const { userId, password, email, address, phoneNumber, userName, termsAgreed } = req;

        // 필수 입력 항목이 누락된 경우 메세지 전송
        if (!userId || !password || !email || !userName) {
            throw new Error('아이디, 비밀번호, 이메일, 이름을 모두 입력해주세요.');
        }

        const existingUserId = await userModel.findByUserId(userId);
        if (existingUserId) {
            throw new Error('중복된 아이디입니다.');
        }

        if (!this.isValidPassword(password)) {
            throw new Error('비밀번호는 최소 8자리 이상이며, 특수문자를 포함해야 합니다.');
        }

        if (!this.isValidName(userName)) {
            throw new Error('이름은 숫자나 특수문자를 포함할 수 없습니다.');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('올바른 이메일 형식이 아닙니다.');
        }

        if (!termsAgreed) {
            throw new Error('약관에 동의해주세요.');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);


        // 유저 생성 및 db 저장
        const newUser = await userModel.create({
            userId,
            password: hashedPassword,
            address,
            email,
            phoneNumber,
            userName,
            isAdmin: false,
            termsAgreed,
        });

        return newUser;
    };

    // 로그인 로직 구현
    async login(req, res) {

        // 유저 아이디, 비밀번호 받아옴
        const { userId, password } = req;

        // 아이디로 해당 유저 검색
        const user = await userModel.findByUserId(userId);

        // 아이디가 db에 없을 경우 에러 메세지 전송
        if (!user) {
            throw new Error('가입되지 않은 아이디 입니다.');
        }

        // 비밀번호 일치 여부 확인
        const isMatched = await bcrypt.compare(password, user.password);

        // 일치하지 않을 경우 에러 메세지 전송
        if (!isMatched) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        // 유저 id, 관리자 여부 객체로 토큰 페이로드 정보 생성
        const payload = {
            userId: user.userId,
            isAdmin: user.isAdmin,
        };

        // jwt.js에서 작성된 토큰 생성 코드 실행
        const token = generateToken(payload);

        // 'token' 이라는 쿠키 이름으로 토큰 저장, 'httpOnly' 옵션으로 접근 보호
        // 'maxAge' 옵션을 3600000(1시간, 밀리초) 설정
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.json({ message: '성공적으로 로그인 되었습니다.', user, token });
    };

    // 로그아웃 로직 구현
    logout(req, res) {
        res.clearCookie('token'); // 로그아웃시 쿠키 삭제
        res.json({ message: '로그아웃 되었습니다.' });
    };

    // 사용자 ID로 사용자 정보 조회
    async getUserById(userId) {
        const user = await userModel.findByUserId(userId);
        if (!user) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }
        return user;
    };

    // 사용자 ID와 입력받은 비밀번호를 이용해 비밀번호 일치 여부 확인
    async isPasswordMatch(userId, currentPassword) {
        const user = await this.getUserById(userId);
        return bcrypt.compare(currentPassword, user.password);
    }

    // 사용자 ID와 업데이트할 데이터를 받아와 정보 수정
    async updateUser(userId, updateData) {

        // 입력된 비밀번호가 있는 경우 해시 처리
        if (updateData.password) {
            const newPasswordHash = await bcrypt.hash(updateData.password, saltRounds);
            updateData.password = newPasswordHash;
        }

        const user = await userModel.update(userId, updateData);
        if (!user) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }
        return user;
    };

    // 사용자 ID를 이용해 사용자 정보 삭제
    async deleteUser(userId) {
        const result = await userModel.deleteByUserId(userId);
        if (!result) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }
    };
};

const userService = new UserService();

module.exports = userService; // user 서비스 객체 내보내기

