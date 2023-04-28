import * as Api from "../api.js";

const inputId = document.querySelector("#inputId");
const inputPassword = document.querySelector("#inputPassword");
const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");
const isLogin = sessionStorage.getItem('token');

// 로그인상태면 메인으로 넘기기
if(isLogin){
    window.location.href = '/'
    alert('잘못된 접근입니다');
}
// id, password 길이 확인후 button disable
[inputId, inputPassword].forEach((element) => element.addEventListener("keyup", checkLength));

// 로그인 버튼 클릭시
loginButton.addEventListener("click", handleLogin);

// 회원가입 버튼 클릭시
registerButton.addEventListener("click", toRegisterPage);

function checkLength() {
    const id = inputId.value;
    const password = inputPassword.value;
    loginButton.classList.toggle("disabled", !id || password.length < 8);
}
async function handleLogin(e) {
    e.preventDefault();
    const userId = inputId.value;
    const password = inputPassword.value;
    const data = {userId, password}
    // 로그인 api 요청
    try {
        const result = await Api.post("/api/users/login", data);
        const token = result.token;
        const userName = result.user.name
        const isAdmin = result.user.isAdmin;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("isAdmin", isAdmin);
        alert(`${userName}님, 어서오세요!`);
        history.back();
    }catch(err){
        alert(err.message);
    }
}
function toRegisterPage(e){
    e.preventDefault()
    window.location.href = "/register";
}