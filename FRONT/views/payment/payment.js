import * as Api from "../api.js";

// const userName = document.querySelector("#name");
// const userEmail = document.querySelector("#email");
// const userPhoneNumber = document.querySelector("#phoneNumber");
// const userAddress = document.querySelector("#userAddress");
const infoBtn = document.querySelector("#infoBtn");
const receiverName = document.querySelector("#receiverName");
const receiverEmail = document.querySelector("#receiverEmail");
const receiverPhoneNumber = document.querySelector("#receiverPhoneNumber");
const userAddress = document.querySelector("#address");
const receiverRequirement = document.querySelector("#receiverRequirement");
const paymentBtn = document.querySelector("#paymentBtn");
const isLogin = sessionStorage.getItem('token');

paymentBtn.addEventListener("click", handlePayment);
// user-info에서 get 받아오기
async function getData() {
    try {
        return await Api.get('/api/users/user-info');
    } catch (err) {
        console.log(err.message);
    }
}
// 로그인시에는 구매자 정보 띄워줌
if (isLogin) {
    const {name, email, phoneNumber, address} = await getData();
    const userInfo = `
    <h2 class="fs-5">구매자 정보</h2>
            <section class="mb-3 border border-dark px-4 py-3">
                <div class="row mb-2">
                    <div class="col-3 fs-6">이름</div>
                    <div class="col" id="name">${name}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-3 fs-6">이메일</div>
                    <div class="col" id="email">${email}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-3 fs-6">연락처</div>
                    <div class="col" id="phoneNumber">${phoneNumber}</div>
                </div>
                <div class="row">
                    <div class="col-3 fs-6">주소</div>
                    <div class="col" id="userAddress">${address}</div>
                </div>
            </section>
    `
    document.querySelector("main").insertAdjacentHTML("afterbegin", userInfo);
    // 구매자 정보와 동일 버튼
    infoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        receiverName.value = name;
        receiverEmail.value = email;
        receiverPhoneNumber.value = phoneNumber;
        userAddress.value = address;
    });
} else {
    infoBtn.style.display = 'none';
}
async function handlePayment(e){
    e.preventDefault();
    // const userId =
    const data = {};
    const result = await Api.post("/api/order/create-order", data);
}