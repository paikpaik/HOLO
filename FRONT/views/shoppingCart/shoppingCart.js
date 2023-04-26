const cartItem = document.querySelector(".cart-item");
const purchaseBtn = document.querySelector(".purchase-btn");
const productPrice = document.querySelector(".product-price");
const productAmount = document.querySelector(".amount");

const menu = JSON.parse(window.localStorage.getItem("menu"));
const purchaseBtnHandler = () => {
  const { productName, price } = menu.product;
  const { amount } = menu;

  cartItem.innerText = productName;
  productPrice.innerText = price;
  productAmount.innerText = amount;
};

purchaseBtn.addEventListener("click", purchaseBtnHandler);
