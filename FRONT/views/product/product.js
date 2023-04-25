import * as API from "../../api/api.js";

const addCartItemBtn = document.getElementById("add-cart-item-btn");
const inquiriesBtn = document.getElementById("inquiries");
const quantity = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");
const mainContent = document.querySelector(".main-content");
const infoBtn = document.getElementById("info");

async function data() {
  return await API.get("/api/products/product");
}

async function createInquiries() {
  return await API.post("/api/products/inquiries");
}

let menu = [
  {
    orderItems: {
      productNo: "메뉴이름1",
      price: "19,000",
      quantity: Number(quantity.textContent),
    },
  },
];

// 상품 수량 조절
const decreaseBtnHandler = () => {
  if (quantity.innerText > 1) {
    quantity.innerText = Number(quantity.innerText) - 1;
    menu.quantity -= 1;
  }
};

const increaseBtnHandler = () => {
  quantity.innerText = Number(quantity.innerText) + 1;
  menu.quantity += 1;
};

// setStorage
const addCartItemBtnHandler = () => {
  window.localStorage.setItem("menu", JSON.stringify(menu));
};

// 상품 상세페이지 HTML
const detailInfo = ` 
<div class="row">
  <img src="..." class="rounded float-start" alt="이미지" />
</div>`;

// 상품 문의 HTML
const inquiriesList = `
  <div class="row">
    <div class="question-box">
      <table class="table table-sm table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">순서</th>
            <th scope="col">제목</th>
            <th scope="col">작성자</th>
            <th scope="col">작성일</th>
            <th scope="col">답변상태</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>진짜 맛있나요? 진짜 맛있나요? 진짜 맛있나요?</td>
            <td>퓨라늄</td>
            <td>23.04.18</td>
            <td>답변완료</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>생으로 먹어도 맛있네요</td>
            <td>김소현</td>
            <td>23.04.19</td>
            <td>미응답</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>사이즈가 딱 맞네요!</td>
            <td>최현준</td>
            <td>23.04.19</td>
            <td>미응답</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container edit-btn">
    <div class="row-12">
      <button id="inquiriesList-btn" type="button" class="btn btn-success">
        글쓰기
      </button>
    </div>
  </div>
</div>`;

// 상품 문의 작성 HTML
const inquiriesbox = `
<div class="container">
<div class="row">
  <div class="list-box">
    <ul id="list">
      <li>
        <p class="content">{게시글 본문 내용}</p>
      </li>
    </ul>
  </div>
</div>
</div>
<div class="container write-input">
<div class="row">
  <div>
    <label for="userName">작성자</label>
    <input type="text" id="userName" />
  </div>
  <div>
    <label for="title">제목</label>
    <input type="text" id="title" />
  </div>
  <div>
    <label for="content">내용</label>
    <textarea id="content"></textarea>
  </div>
  <button id="btnAddTxt" class="btn btn-success">글쓰기</button>
</div>
</div>`;

// 상품 상세페이지 버튼
const infoBtnHandler = () => {
  mainContent.innerHTML = detailInfo;
  infoBtn.className = "btn btn-success";
  inquiriesBtn.className = "btn btn-secondary btn-lr";
};

// 상품 문의 작성 버튼
const inquiriesListBtnHandler = () => {
  mainContent.insertAdjacentHTML("afterend", inquiriesbox);
};

// 상품 문의 버튼
const inquiriesBtnHandler = () => {
  mainContent.innerHTML = inquiriesList;
  infoBtn.className = "btn btn-secondary btn-lr";
  inquiriesBtn.className = "btn btn-success";
  const inquiriesListBtn = document.getElementById("inquiriesList-btn");
  inquiriesListBtn.addEventListener("click", inquiriesListBtnHandler);
};

addCartItemBtn.addEventListener("click", addCartItemBtnHandler);
decreaseBtn.addEventListener("click", decreaseBtnHandler);
increaseBtn.addEventListener("click", increaseBtnHandler);
inquiriesBtn.addEventListener("click", inquiriesBtnHandler);
infoBtn.addEventListener("click", infoBtnHandler);
