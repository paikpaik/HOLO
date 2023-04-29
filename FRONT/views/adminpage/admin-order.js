import * as Api from "../api.js";

const orderList = document.querySelector(".order-list-container");
const startDateControl = document.querySelector('input[type="date"]#startDate');
const endDateControl = document.querySelector('input[type="date"]#endDate');
const dateControl = document.querySelector("div#getOrdersByDate");
let startDate = startDateControl.value;
let endDate = endDateControl.value;

const orders = await getAllOrders();

async function getAllOrders() {
  try {
    const ordersObj = await Api.get("/api/admin/all-orders");
    renderOrders(ordersObj.ordersWithUser);
    return ordersObj.ordersWithUser;
  } catch (e) {
    console.log(e.message);
    if (e.message === "관리자 권한이 필요합니다.") {
      sessionStorage.setItem("isAdmin", false);
      location.href = "/";
    }
  }
}

function renderOrders(orders) {
  orderList.innerHTML = "";
  orders.forEach((order, idx) => {
    orderList.innerHTML += `  
    <div class="accordion accordion-flush order-container" data-id=${
      order._id
    } id="accordion${idx}">
    <div class="modal fade" id="deliveryModifyModal${
      order._id
    }" tabindex="-1" aria-labelledby="deliveryModifyModalLabel" aria-hidden="true">
      <div class="modal-dialog  modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">배송 상태 변경</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="deliveryStatus" id="pending">
              <label class="form-check-label" for="pending">
                결제 전
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="deliveryStatus" id="processing">
              <label class="form-check-label" for="processing">
                배송 준비중
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="deliveryStatus" id="shipped">
              <label class="form-check-label" for="shipped">
                배송중
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="deliveryStatus" id="delivered">
              <label class="form-check-label" for="delivered">
                배송 완료
               </label>
            </div>
            <div class="form-check">
            <input class="form-check-input" type="radio" name="deliveryStatus" id="canceled">
            <label class="form-check-label" for="canceled">
              주문 취소
          </label>
          </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-success">저장</button>
          </div>
        </div>
      </div>
    </div>
      <div class="accordion-item order-item shadow-sm p-3 bg-body-tertiary rounded">
        <h6 class="accordion-header" id="heading${idx}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idx}" aria-expanded="false" aria-controls="collapse${idx}">
          </button>
        </h6>
        <div class="product-info">
          <div class="order-detail">
            <div class="order-id">
              <h5>주문번호</h5>
              <p>${order._id}</p>
            </div>
            <div class="order-user">
              <p>주문자</p>
              <p>${order.userId}</p>
            </div>
            <div class="order-date">
              <p>주문일자</p>
              <p>${order.createdAt?.split("T")[0]}</p>
            </div>
            <div class="order-info">
              <p>상품가격/개수</p>
              <p>${order.totalPrice} / ${order.orderItems.length}</p>
            </div>
          </div>
        </div>
  
        <div class="order-item-btn-container">
          <button type="button" class="btn btn-outline-success btn-delivery-modify"  data-bs-toggle="modal" data-bs-target="#deliveryModifyModal${
            order._id
          }" data-status="${order.status}">
            ${getDeliveryStatus(order.status)}
          </button>
          <button
            type="button"
            class="btn btn-outline-success btn-order-delete"
          >
            주문 삭제
          </button>
         
        </div>
        

        </div>
        <div id="collapse${idx}" class="accordion-collapse collapse" aria-labelledby="heading${idx}" data-bs-parent="#accordion${idx}">
        <div class="accordion-body">
          ${order.orderItems
            .map((item) => {
              return `
              <div class="product-info row">
                <div class="product ">
                  <div class="col-3">상품 아이디</div>
                  <div>${item.productId}</div>
                </div>
                <div class="product ">
                  <div class="col-3">상품 가격</div>
                  <div>${item.price}</div>
                </div>
                <div class="product ">
                  <div class="col-3">상품 개수</div>
                  <div>${item.quantity}</div>
                </div>
                <div class="product ">
                  <div class="col-3">할인율</div>
                  <div>${item.discountRate}%</div>
                </div>
              </div>
                `;
            })
            .join("")}

        </div>
        </div>
      </div>
   
    </div>`;
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

const orderContainers = document.querySelectorAll(".order-container");

orderContainers.forEach((orderContainer) => {
  orderContainer.addEventListener("click", (e) => {
    const orderId = orderContainer.dataset.id;

    if (e.target.classList.contains("btn-order-delete")) {
      deleteOrder(orderId);
    } else if (e.target.classList.contains("btn-delivery-modify")) {
      initDeliveryStatusModal(e.target.dataset.status, orderId);
    }
  });
});

async function deleteOrder(id) {
  const res = confirm("주문을 삭제하시겠습니까?");
  if (!res) return;
  try {
    await Api.delete(`/api/admin/delete-order/${id}`);
    alert("주문이 삭제되었습니다.");
    location.reload();
  } catch (e) {
    console.log(e);
  }
}

function initDeliveryStatusModal(status, id) {
  const modal = document.querySelector(`#deliveryModifyModal${id}`);
  const modalInputs = modal.querySelectorAll(".modal .form-check-input");
  modalInputs.forEach((input) => {
    if (input.id === status) {
      input.checked = true;
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-success")) {
      const deliveryStatus = modal.querySelector(
        ".modal .form-check-input:checked"
      ).id;
      updateDeliveryStatus(deliveryStatus, id);
    }
  });
}

async function updateDeliveryStatus(status, id) {
  const res = confirm("배송 상태를 변경하시겠습니까?");
  if (!res) return;
  try {
    await Api.patch(`/api/admin/updatedStatus`, id, { status });
    alert("배송 상태가 변경되었습니다.");
    location.reload();
  } catch (e) {
    console.log(e);
  }
}

dateControl.addEventListener("change", (e) => {
  if (e.target.id === "startDate") {
    startDate = e.target.value;
  } else {
    endDate = e.target.value;
  }
  getOrders();
});

function getOrders() {
  if (startDate === "" || endDate === "") return;
  if (startDate > endDate) {
    alert("시작일이 종료일보다 늦습니다.");
    document.getElementById("endDate").value = startDate;
    return;
  } else {
    const filteredOrders = orders.filter((order) => {
      const orderDate = order.createdAt.split("T")[0];
      return orderDate >= startDate && orderDate <= endDate;
    });

    renderOrders(filteredOrders);
  }
}
