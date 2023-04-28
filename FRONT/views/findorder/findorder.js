import * as Api from '../api.js';

const inputOrderId = document.querySelector("#inputOrderId");
const inputEmail = document.querySelector("#inputEmail");
const findButton = document.querySelector("#findButton");
const isLogin = sessionStorage.getItem('token');

// 로그인상태면 마이페이지에서 조회
if (isLogin) {
    window.location.href = '/mypage'
    alert('회원 주문조회는 마이페이지에서 가능합니다');
}
// 값 입력 전에는 버튼 비활성화
[inputOrderId, inputEmail].forEach((element) => element.addEventListener("keyup", checkLength))
// 조회버튼 클릭시
findButton.addEventListener("click", findOrder);

function checkLength() {
    const id = inputOrderId.value;
    const password = inputEmail.value;
    findButton.classList.toggle("disabled", !id || password.length < 8);
}

// 주문 조회 api 호출
async function findOrder(e) {
    e.preventDefault();
    const orderId = inputOrderId.value;
    const email = inputEmail.value;
    try {
        const {order} = await Api.get(`/api/order/find-orders/${orderId}/${email}`);
        const {orderItems, totalPrice, totalDiscount} = order;
        console.log(orderItems);
        let itemContent = '';
        for(const item of orderItems){
            const { productName, price, discountRate, imagePaths } = await findProduct(item.productId);
            itemContent += `<div class="row border border-dark my-2">
                <div class="col-3 my-2">
                    <img src="../${imagePaths[0]}" alt="${productName}" class="img-fluid">
                </div>
                <div class="col-9">
                    <div class="fs-4 my-2">${productName}</div>
                    <div class="mb-5 fs-5">${price * (100 - discountRate) / 100}원 / ${item.quantity}개</div>
                    <div class="d-flex my-2">
                        <div class="ms-auto me-3">총 ${price * (100 - discountRate) / 100 * item.quantity}원</div>
                    </div>
                </div>
            </div>`
        }
        document.querySelector("#orderContent").innerHTML = `
    <div class="d-inline-block text-start my-3 px-3 col-lg-8 col-md-10 col-12 mx-auto">
        <h2 class="fs-5" id="orderList">주문내역</h2>
         ${itemContent}
        <div class="row pt-3" id="shippingPrice">
        <div class="col-3 fs-5">배송비</div>
        <div class="col-9 fs-5">3000 원</div>
        </div>
        <div class="row my-3">
        <div class="col-3 fs-5">총 결제금액</div>
        <div class="col-9 fs-5">${totalPrice - totalDiscount + 3000} 원</div>
        </div>
    </div>
    `;
    } catch (err) {
        console.log(err.message);
    }
}
async function findProduct(productId){
    try{
        return await Api.get(`/api/products/${productId}`);
    } catch(err) {
        console.log(err.message);
    }
}