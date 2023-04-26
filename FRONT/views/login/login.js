import * as Api from "../../api/api.js";

const inputId = document.querySelector("#inputId");
const inputPassword = document.querySelector("#inputPassword");
const loginButton = document.querySelector("#loginButton");
const registerButton = document.querySelector("#registerButton");

// id, password 길이 확인후 button disable
[inputId, inputPassword].forEach((element) =>
  element.addEventListener("keyup", checkLength)
);

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
  const data = { userId, password };
  // 로그인 api 요청
  try {
    const result = await Api.post("/api/users/login", data);
    const token = result.token;

    sessionStorage.setItem("token", token);
    alert(`${userId}님, 어서오세요!`);
    window.location.href = "/";
  } catch (err) {
    console.log(err.stack);
    alert(`${err.message}`);
  }
}
function toRegisterPage(e) {
  e.preventDefault();
  window.location.href = "/register";
}
