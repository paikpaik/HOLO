import * as Api from '../api.js';
const isValid = sessionStorage.getItem('validAccess') === 'toOrderCompleted';

if (!isValid){
    window.location.href = '/';
    alert("잘못된 접근입니다");
}
sessionStorage.removeItem('validAccess');
window.onbeforeunload = () => sessionStorage.setItem('validAccess', 'toPayment');
await getOrderData();

async function getOrderData() {
    const url = new URL(window.location.href);
    const {_id, email} = JSON.parse(url.searchParams.get('orderId'));
    try {
        const { order } = await Api.get(`/api/order/find-orders/${_id}/${email}`);
        const { orderItems, totalPrice, totalDiscount } = order;
        console.log(orderItems);
        document.querySelector("#totalPrice").innerText = `${totalPrice - totalDiscount + 3000} 원`
        document.querySelector("#orderId").innerText = `주문번호 : ${_id}`;
        for(let i = 0; i < orderItems.length; i++){
            if(i > 2){
                const itemNumber = `<div class="text-end">
                <div class="fs-5">외 ${orderItems.length - 3}개</div>
            </div>`
                document.querySelector("#shippingPrice").insertAdjacentHTML("beforebegin", itemNumber);
                break;
            }
            const orderItem = orderItems[i];
            console.log(orderItem.productId);
            const { productName, price, discountRate, imagePaths } = await findProduct(orderItem.productId);
            const itemContent = `<div class="row border border-dark my-2">
                <div class="col-3 my-2">
                    <img src="../${imagePaths[0]}" alt="${productName}" class="img-fluid">
                </div>
                <div class="col-9">
                    <div class="fs-4 my-2">${productName}</div>
                    <div class="mb-5 fs-5">${price * (100 - discountRate) / 100}원 / ${orderItem.quantity}개</div>
                    <div class="d-flex my-2">
                        <div class="ms-auto me-3">총 ${price * (100 - discountRate) / 100 * orderItem.quantity}원</div>
                    </div>
                </div>
            </div>`
            document.querySelector("#orderList").insertAdjacentHTML("afterend", itemContent);
        }

    } catch(err) {
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