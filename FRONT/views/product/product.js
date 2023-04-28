import * as Api from "../api.js";

const addCartItemBtn = document.getElementById("add-cart-item-btn");
const quantity = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");
const productName = document.querySelector(".product-name");
const price = document.querySelector(".price");
const totalPrice = document.querySelector(".total-price");
const purchaseBtn = document.getElementById("purchase-btn");
const insertImage = document.querySelector(".rounded.float-start");
const detailImage = document.querySelector(".detail-image");

let cart = JSON.parse(localStorage.getItem("cart"));

let productQuantity = 1;

const url = new URL(window.location.href);
const productId = url.searchParams.get("productId");
const product = await getData();
async function getData() {
  try {
    const product = await Api.get(`/api/products/${productId}`);
    printData(product);
    printData(product);
    return product;
  } catch (e) {}
}

function printData(product) {
  productName.innerText = product.productName;
  price.innerText = product.price;
  totalPrice.innerText = product.price;
  insertImage.src = `../${product.imagePaths[0]}`;
  detailImage.src = `../${product.imagePaths[1]}`;
  console.log(product.imagePaths[0]);
}

// setStorage
const addCartItemBtnHandler = async () => {
  if (cart) {
    const idx = cart.findIndex(
      (m) => m.orderItems.productName === product.productName
    );
    if (idx != -1) {
      // 이미 장바구니에 상품이 있을 때
      cart[idx].orderItems.quantity += productQuantity;
      alert(
        `장바구니에 ${product.productName}상품을
${productQuantity}개 추가로 담았어요.`
      );
    } else {
      // 장바구니에 없는 새로운 상품일 때
      addNewProduct(cart);
      alert(
        `${product.productName}상품이 장바구니에 ${productQuantity}개 담겼습니다.`
      );
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

const purchaseBtnHandler = async (e) => {
  try {
    e.preventDefault();
    const orderitems = [
      {
        productId: product._id,
        productName: product.productName,
        price: product.price,
        quantity: productQuantity,
        discountRate: product.discountRate,
      },
    ];
    sessionStorage.setItem("validAccess", "toPayment");
    window.location.href = `/payment?order=${JSON.stringify(orderitems)}`;
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

addCartItemBtn.addEventListener("click", addCartItemBtnHandler);
decreaseBtn.addEventListener("click", decreaseBtnHandler);
increaseBtn.addEventListener("click", increaseBtnHandler);
purchaseBtn.addEventListener("click", purchaseBtnHandler);
