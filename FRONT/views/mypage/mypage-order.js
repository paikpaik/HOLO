import * as Api from "../api.js";

await getOrderList();
async function getOrderList() {
  try {
    const orders = await Api.get("/api/order/find-orders");
    console.log(orders);
    renderOrderList(orders);
  } catch (err) {
    alert(err.message);
  }
}

function renderOrderList(orders) {
  const orderList = document.querySelector("#orderList");
  orders.forEach((order, idx) => {
    const {
      _id,
      createdAt,
      orderItems,
      status,
      shippingAddress,
      shippingMemo,
      totalDiscount,
      totalPrice,
    } = order;
    orderList.innerHTML += `
    <div class="order-item shadow-sm p-3 mb-5 bg-body-tertiary rounded" data-id="${_id}">
    <div class="product-info row">
      <div class="product-detail">
        <div class="info">
          <h4 class="col-6">주문번호</h4>
          <p>${_id}</p>
        </div>
        <div class="info">
          <p class="col-6">상품가격 / 개수</p>
          <p>총 ${totalPrice}원 / ${orderItems.length}</p>
        </div>
        <div class="info">
          <p class="col-6">주문일자</p>
          <p>${createdAt?.split("T")[0]}</p>
        </div>
        <div class="info">
          <p class="col-6">배송상태</p>
          <p>${getDeliveryStatus(status)}</p>
        </div>
      </div>
    </div>
    <div class="order-item-btn-container show">
      <button
        type="button"
        class="btn btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#addressModifyModal"
      >
        배송지 수정
      </button>
      <button type="button" class="btn btn-outline-success btn-cancel">
        취소하기
      </button>
   
    </div>
  </div>
  <div class="modal fade" tabindex="-1" id="addressModifyModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3 row">
                    <label for="name" class="col-sm-2 col-form-label"
                      >이름</label
                    >
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        placeholder="이름을 입력해주세요."
                      />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="address" class="col-sm-2 col-form-label"
                      >배송주소</label
                    >
                    <div class="col-7">
                      <input
                        type="text"
                        readonly
                        class="form-control"
                        id="address"
                        placeholder="주소 찾기 버튼을 클릭해 주세요."
                      />
                    </div>
                    <div class="col-3">
                      <button class="btn btn-success" id="searchAddressBtn">
                        주소 찾기
                      </button>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="detailAddress" class="col-sm-2 col-form-label"
                      >상세주소</label
                    >
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="detailAddress"
                        placeholder="상세주소를 입력해주세요."
                      />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="" class="col-sm-2 col-form-label"
                      >배송 요청사항</label
                    >
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id=""
                        placeholder="요청사항을 입력해주세요."
                      />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="phoneNumber" class="col-sm-2 col-form-label"
                      >연락처</label
                    >
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="phoneNumber"
                        placeholder="연락처를 입력해주세요."
                      />
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-success">
                    수정 완료
                  </button>
                </div>
              </div>
            </div>
          </div>
    `;
    const deliveryBtn = document.querySelector(".order-item-btn-container");
    if (status !== "pending" && status !== "processing") {
      deliveryBtn.classList.remove("show");
    }
  });
}

function getDeliveryStatus(status) {
  switch (status) {
    case "pending":
      return "결제 전";
    case "processing":
      return "배송 준비중";
    case "shipped":
      return "배송중";
    case "delivered":
      return "배송 완료";
    case "canceled":
      return "주문 취소";
  }
}

const orderItems = document.querySelectorAll(".order-item");
orderItems.forEach((orderItem) => {
  orderItem.addEventListener("click", (e) => {
    const orderId = orderItem.dataset.id;
    if (e.target.classList.contains("btn-cancel")) {
      cancelOrder(orderId);
    }
  });
});

async function cancelOrder(orderId) {
  try {
    const res = await Api.post(`/api/order/find-orders/${orderId}/cancel`);
    console.log(res);
  } catch (err) {
    alert(err.message);
  }
}
