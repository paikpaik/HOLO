const userModel = require('../db/models/userModel'); // user 모델 불러오기
const sendEmail = require('../utils/sendEmail'); // sendEmail 유틸리티 불러오기

class AdminService {
    // 모든 사용자 정보 조회
    async getAllUsers() {
        const users = await userModel.findAll();
        return users;
    };

    // 사용자의 회원 정보 삭제
    async deleteUser(userId) {
        const user = await userModel.findByUserId(userId);

        if (!user) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }

        // userId로 해당 회원을 검색해 정보 삭제
        await userModel.deleteByUserId(userId);

        // 회원 탈퇴 처리가 완료된 후 이메일로 탈퇴 사실을 알림
        const emailContent =
            `안녕하세요, ${user.name}님.
  
            회원 정보가 성공적으로 삭제되었습니다.
            그동안 저희 'HOLO'를 이용해주셔서 대단히 감사합니다.`;

        await sendEmail({
            to: user.email,
            subject: '회원 탈퇴 처리 완료',
            text: emailContent,
        });
    };
};

const adminService = new AdminService;

module.exports = adminService;