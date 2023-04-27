import * as Api from "../api.js";

const infoBtn = document.querySelector("#infoBtn");
const receiverName = document.querySelector("#receiverName");
const receiverEmail = document.querySelector("#receiverEmail");
const receiverPhoneNumber = document.querySelector("#receiverPhoneNumber");
const userAddress = document.querySelector("#address");
const detailAddress = document.querySelector("#detailAddress");
const receiverRequirement = document.querySelector("#receiverRequirement");
const paymentBtn = document.querySelector("#paymentBtn");
const isLogin = sessionStorage.getItem('token');

const {orderItems, totalPrice, totalDiscount} = getOrderData();
setData(totalPrice, totalDiscount);
paymentBtn.addEventListener("click", handlePayment);

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

// user-info에서 get 받아오기
async function getData() {
    try {
        return await Api.get('/api/users/user-info');
    } catch (err) {
        console.log(err.message);
    }
}

// 상품정보 가져오기
function getOrderData() {
    const url = new URL(window.location.href);
    const orderItems = JSON.parse(url.searchParams.get('order'));
    const {totalPrice, totalDiscount} = orderItems.reduce(({totalPrice, totalDiscount}, {
        quantity,
        price,
        discountRate
    }) => {
        totalPrice = price * quantity;
        totalDiscount = price * discountRate / 100 * quantity;
        return {totalPrice, totalDiscount};
    }, {totalPrice: 0, totalDiscount: 0})
    return {orderItems, totalPrice, totalDiscount};
}

// 상품정보 띄우기
function setData(totalPrice, totalDiscount) {
    document.querySelector("#totalPrice").innerText = `${totalPrice} 원`;
    document.querySelector("#totalDiscount").innerText = `-${totalDiscount} 원`;
    document.querySelector("#totalDiscountPrice").innerText = `${totalPrice - totalDiscount} 원`;
}

// 결제완료 페이지로 보내기
async function handlePayment(e) {
    e.preventDefault();
    const userId = receiverName.value;
    const email = receiverEmail.value;
    const shippingAddress = userAddress.value + detailAddress.value;
    const shippingMemo = receiverRequirement.value;
    const data = {
        userId,
        email,
        orderItems,
        shippingAddress,
        shippingMemo,
        totalPrice,
        totalDiscount,
    };
    console.log(data);
    try {
        await Api.post("/api/order/create-order", data);
    } catch (err) {
        alert(err.message);
    }
}
