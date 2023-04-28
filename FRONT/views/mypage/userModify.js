import * as Api from "../api.js";
const passwordInput = document.querySelector("#password");
const passwordCheckBtn = document.querySelector("#passwordCheckBtn");
const userModifyForm = document.querySelector("#userModify form");
const userId = document.querySelector("#userId");
let newPasswordInput;
let newPasswordCheckInput;
let phoneNumberInput;
passwordInput.addEventListener("input", handlePasswordInputCheck);
passwordCheckBtn.addEventListener("click", handlePasswordCheck);

const user = await getUserData();
console.log(user);
async function getUserData() {
  try {
    const data = await Api.get("/api/users/user-info");
    userId.value = data.userId;
    return data;
  } catch (e) {
    alert(e.message);
    location.href = "/";
  }
}

function handlePasswordInputCheck(e) {
  if (e.target.value.length < 8) {
    passwordCheckBtn.disabled = true;
  } else {
    passwordCheckBtn.disabled = false;
  }
}

async function handlePasswordCheck(e) {
  e.preventDefault();
  try {
    const res = await Api.post("/api/users/check-password", {
      currentPassword: passwordInput.value,
    });
    renderUserModifyForm();
  } catch (e) {
    alert(e.message);
    return;
  }
}

function renderUserModifyForm() {
  const { userId, name, phoneNumber, address, email } = user;
  const form = `
    <div class="mb-3 row">
      <label for="userId" class="col-sm-4 col-form-label">아이디</label>
      <div class="col-sm-8">
        <input
          type="text"
          readonly
          class="form-control-plaintext"
          id="userId"
          value="${userId}"
        />
      </div>
    </div>
    <div class="mb-3 row">
      <label for="newPassword" class="col-sm-4 col-form-label">새 비밀번호</label>
      <div class="col-sm-8">
        <input
          type="password"
          class="form-control"
          id="newPassword"
          placeholder="변경할 비밀번호를 입력해주세요"
        />
      </div>
    </div>
    <div class="mb-3 row">
      <label for="newPasswordCheck" class="col-sm-4 col-form-label"
        >비밀번호 확인</label
      >
      <div class="col-sm-8">
        <input
          type="password"
          class="form-control"
          id="newPasswordCheck"
          placeholder="한번 더 입력해주세요"
        />
      </div>
    </div>
    <div class="mb-3 row">
      <label for="name" class="col-sm-4 col-form-label">이름</label>
      <div class="col-sm-5">
        <input
          readonly
          type="text"
          class="form-control-plaintext"
          id="name"
          value="${name}"
        />
      </div>
    </div>
    <div class="mb-3 row">
      <label for="phoneNumber" class="col-sm-4 col-form-label">연락처</label>
      <div class="col-sm-5">
        <input
          readonly
          type="text"
          class="form-control-plaintext"
          id="phoneNumber"
          value="${phoneNumber}"
        />
      </div>
      <div class="col-sm-3 btn-container">
        <button
          type="button"
          class="btn btn-outline-success"
          id="modifyPhoneNumberBtn"
        >
          변경하기
        </button>
      </div>
    </div>
    <div class="mb-3 row">
      <label for="email" class="col-sm-4 col-form-label">이메일</label>
      <div class="col-sm-8">
        <input
          readonly
          type="email"
          class="form-control-plaintext"
          id="email"
          value="${email}"
        />
      </div>
    </div>
    <div class="withdrawal">
      <div class="withdrawal-message">
        탈퇴를 원하시면 우측의 회원탈퇴 버튼을 눌러주세요.
      </div>
      <button type="button" class="btn btn btn-secondary" id="withdrawalBtn">
        회원탈퇴
      </button>
    </div>

    <button type="button" class="btn btn-success" id="saveBtn" disabled>
      저장하기
    </button>
  `;
  userModifyForm.innerHTML = form;

  // 폼 변경 후 이벤트 리스너 추가
  addFormEventListeners();
}

function addFormEventListeners() {
  newPasswordInput = document.querySelector("#newPassword");
  newPasswordCheckInput = document.querySelector("#newPasswordCheck");
  const modifyPhoneNumberBtn = document.querySelector("#modifyPhoneNumberBtn");
  phoneNumberInput = document.querySelector("#phoneNumber");
  const saveBtn = document.querySelector("#saveBtn");
  const withdrawalBtn = document.querySelector("#withdrawalBtn");
  modifyPhoneNumberBtn.addEventListener(
    "click",
    modifyPhoneNumber(phoneNumberInput)
  );

  // 비밀번호 확인
  newPasswordInput.addEventListener("keyup", checkNewPassword);
  newPasswordCheckInput.addEventListener("keyup", checkNewPassword);
  saveBtn.addEventListener("click", handleSave);
  withdrawalBtn.addEventListener("click", handleWithdrawal);
}

function checkNewPassword() {
  const newPassword = newPasswordInput.value;
  const confirmPassword = newPasswordCheckInput.value;
  if (newPassword !== confirmPassword) {
    newPasswordCheckInput.classList.remove("is-valid");
    newPasswordCheckInput.classList.add("is-invalid");
  } else {
    newPasswordCheckInput.classList.remove("is-invalid");
    newPasswordCheckInput.classList.add("is-valid");
  }
  // 둘 다 8자리 이상이면 저장 버튼 활성화
  if (
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword
  ) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

const modifyPhoneNumber = (phoneNumberInput) => (e) => {
  e.preventDefault();
  phoneNumberInput.readOnly = false;
  phoneNumberInput.className = "form-control";
  phoneNumberInput.focus();
};

async function handleSave(e) {
  try {
    const data = {
      password: newPassword.value,
      phoneNumber: phoneNumberInput.value,
    };
    const res = await Api.patch("/api/users/update-user-info", "", data);
    console.log(res);
    // alert("회원정보가 수정되었습니다.");
    // location.reload();
  } catch (err) {
    alert(err.message);
  }
}

async function handleWithdrawal(e) {
  e.preventDefault();
  try {
    await Api.delete("/api/users/delete-user-info");
    const res = confirm("정말로 탈퇴하시겠습니까?");
    if (!res) return;
    alert("회원탈퇴가 완료되었습니다.");
    sessionStorage.clear();
    location.href = "/";
  } catch (err) {
    alert(err.message);
  }
}
