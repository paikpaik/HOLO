// import * as API from "/api/api.js";

const addCartItemBtn = document.getElementById("add-cart-item-btn");
const inquiriesBtn = document.getElementById("inquiries");
const quantity = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");
const mainContent = document.querySelector(".main-content");
const infoBtn = document.getElementById("info");
const productName = document.querySelector(".product-name");
const price = document.querySelector(".price");
const totalPrice = document.querySelector(".total-price");

let productQuantity = 1;

async function getData() {
  const res = await fetch(`/api/products/644778974fdab6097f1927e5`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  productName.innerText = data.data.productName;
  price.innerText = data.data.price;
  totalPrice.innerText = data.data.price;

  return data;
}

const data = await getData();

// setStorage
const addCartItemBtnHandler = () => {
  if (menu) {
    const idx = menu.findIndex(
      (m) => m.orderItems.productName === data.data.productName
    );
    if (idx != -1) {
      // 이미 장바구니에 상품이 있을 때
      menu[idx].orderItems.quantity += productQuantity;
    } else {
      // 장바구니에 없는 새로운 상품일 때
      addNewProduct(menu);
    }
  } else {
    // 장바구니에 아무런 상품도 없을 때
    menu = [];
    addNewProduct(menu);
  }
  window.localStorage.setItem("menu", JSON.stringify(menu));
};

const addNewProduct = (menu) => {
  let newProduct = {
    orderItems: {
      productName: data.data.productName,
      price: data.data.price,
      quantity: productQuantity,
    },
  };
  menu.push(newProduct);
};

async function createInquiries() {
  return await API.post("/api/products/inquiries");
}

let menu = JSON.parse(localStorage.getItem("menu"));

// 상품 수량 조절
const decreaseBtnHandler = () => {
  if (quantity.innerText > 1) {
    quantity.innerText = Number(quantity.innerText) - 1;
    productQuantity -= 1;
    totalPrice.innerText = quantity.innerText * price.innerText;
  }
};

const increaseBtnHandler = () => {
  quantity.innerText = Number(quantity.innerText) + 1;
  productQuantity += 1;
  totalPrice.innerText = quantity.innerText * price.innerText;
};

// 상품 상세페이지 HTML
const detailInfo = ` 
<div class="row">
<img src="..." class="rounded float-start" alt="이미지" />
</div>`;

// 상품 상세페이지 버튼
const infoBtnHandler = () => {
  mainContent.innerHTML = detailInfo;
  infoBtn.className = "btn btn-success";
  inquiriesBtn.className = "btn btn-secondary btn-lr";
};

addCartItemBtn.addEventListener("click", addCartItemBtnHandler);
decreaseBtn.addEventListener("click", decreaseBtnHandler);
increaseBtn.addEventListener("click", increaseBtnHandler);
inquiriesBtn.addEventListener("click", inquiriesBtnHandler);
infoBtn.addEventListener("click", infoBtnHandler);
