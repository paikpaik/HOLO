const userModel = require('../db/models/userModel'); // user 모델 불러오기
const bcrypt = require('bcrypt'); // 비밀번호 해쉬화를 위한 bcrypt 불러오기
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

        // req.body에서 필요한 정보 받아옴
        const { userId, password, email, address, phoneNumber, userName, termsAgreed } = req.body;

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
    }
}

const userService = new UserService();

module.exports = userService; // user 서비스 객체 내보내기
