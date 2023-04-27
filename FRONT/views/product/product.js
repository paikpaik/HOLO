import * as Api from "../api.js";

const addCartItemBtn = document.getElementById("add-cart-item-btn");
const quantity = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");
// const mainContent = document.querySelector(".main-content");
// const infoBtn = document.getElementById("info");
const productName = document.querySelector(".product-name");
const price = document.querySelector(".price");
const totalPrice = document.querySelector(".total-price");
const purchaseBtn = document.getElementById("purchase-btn");

let cart = JSON.parse(localStorage.getItem("cart"));

let productQuantity = 1;

// const productId = "644a6eebedfeef88f9240690"; // example productId
const url = new URL(window.location.href);
const productId = url.searchParams.get("productId");
const product = await getData();
async function getData() {
  try {
    const product = await Api.get(`/api/products/${productId}`);
    printData(product);
    return product;
  } catch (e) {}
}

function printData(product) {
  productName.innerText = product.productName;
  price.innerText = product.price;
  totalPrice.innerText = product.price;
}

// setStorage
const addCartItemBtnHandler = async () => {
  if (cart) {
    console.log(cart);
    const idx = cart.findIndex(
      (m) => m.orderItems.productName === product.productName
    );
    if (idx != -1) {
      // 이미 장바구니에 상품이 있을 때
      cart[idx].orderItems.quantity += productQuantity;
    } else {
      // 장바구니에 없는 새로운 상품일 때
      addNewProduct(cart);
    }
  } else {
    // 장바구니에 아무런 상품도 없을 때
    cart = [];
    addNewProduct(cart);
  }
  window.localStorage.setItem("cart", JSON.stringify(cart));
};

const addNewProduct = (cart) => {
  let newProduct = {
    orderItems: {
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity: productQuantity,
      discountRate: product.discountRate,
    },
  };
  cart.push(newProduct);
};

const purchaseBtnHandler = async () => {
  try {
    const orderitems = {
      orderItems: [
        {
          productId: product._id,
          productName: product.productName,
          price: product.price,
          quantity: productQuantity,
          discountRate: product.discountRate,
        },
      ],
    };
    console.log(orderitems);
    const res = await Api.post("/api/order/create-cart", orderitems);
    console.log(res.json());
  } catch (e) {
    console.log(e);
  }
};

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

addCartItemBtn.addEventListener("click", addCartItemBtnHandler);
decreaseBtn.addEventListener("click", decreaseBtnHandler);
increaseBtn.addEventListener("click", increaseBtnHandler);
purchaseBtn.addEventListener("click", purchaseBtnHandler);
// api post
