const cartItem = document.querySelector(".cart-item");
const purchaseBtn = document.querySelector(".purchase-btn");
const cartContainer = document.querySelector(".cart-container");
const checkAll = document.getElementById("allCheck");
const totalPriceText = document.querySelector(".total-price");
const decreaseBtn = document.querySelector(".decrease-btn");
const increaseBtn = document.querySelector(".increase-btn");
const removeProductBtn = document.querySelector(".btn.btn-success.remove");
const productAmount = document.querySelector(".product-amount");
const checkTotal = document.querySelector(".form-check-label.all");
const removeAllBtn = document.querySelector(".btn.btn-warning.remove-all");

const cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);

let totalPrice = 0;
productAmount.innerText = `일반구매(${cart.length})`;

const paintCart = (item) => {
  const { productName, price, quantity } = item.orderItems;

  const paintProduct = ` <div class="container text-left li"  >
  <div class="row">
  <div class="col">
  <div class="form-check">
  <input class="form-check-input painted" type="checkbox" id="defaultCheck1" data-id='${productName}'>
  <label class="form-check-label" for="defaultCheck1">
  <p class="cart-item">${productName}</p>
  </label>
  </div>
  </div>
  
  <div class="col">
  <div class="item-count">
  <button
  type="button"
  class="btn btn-secondary btn-sm decrease-btn"
  style="height: 1.5rem"
  >
  -
  </button>
  <p class="quantity asdf">${quantity}</p>
  <button
  type="button"
  class="btn btn-secondary btn-sm increase-btn"
  style="height: 1.5rem"
  >
  +
  </button>
  </div>
  </div>
  
  <div class="col">
  <p class="product-price" >${price * quantity}원</p>
  </div>
  </div>
  </div>`;
  totalPrice += price * quantity;
  cartContainer.insertAdjacentHTML("beforeend", paintProduct);
};

cart.forEach(paintCart);
totalPriceText.innerText = `${totalPrice + 3000}원`;

const checkBoxs = document.querySelectorAll(".form-check-input.painted");

const checkAllHandler = (e) => {
  if (e.target.checked) {
    checkBoxs.forEach((checkbox) => {
      checkbox.checked = true;
      checkedLi.add(checkbox);
    });
  } else {
    checkBoxs.forEach((checkbox) => {
      checkbox.checked = false;
      checkedLi.clear();
    });
  }
};

const increaseBtnHandler = (el, originPrice) => {
  let quantity = el.querySelector(".quantity");
  let productPrice = el.querySelector(".product-price");
  let productName = el.querySelector(".form-check-input").dataset.id;

  cart.filter(
    (item) => item.orderItems.productName === productName
  )[0].orderItems.quantity += 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  quantity.innerText = Number(quantity.innerText) + 1;
  productPrice.innerText = originPrice * Number(quantity.innerText) + "원";
  totalPriceText.innerText =
    Number(totalPriceText.innerText.replace(/[^0-9]/g, "")) +
    originPrice +
    "원";
};

const decreaseBtnHandler = (el, originPrice) => {
  let quantity = el.querySelector(".quantity");
  let productPrice = el.querySelector(".product-price");
  let productName = el.querySelector(".form-check-input").dataset.id;

  cart.filter(
    (item) => item.orderItems.productName === productName
  )[0].orderItems.quantity -= 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  if (quantity.innerText > 1) {
    quantity.innerText = Number(quantity.innerText) - 1;
    productPrice.innerText = originPrice * Number(quantity.innerText) + "원";
  }
  totalPriceText.innerText =
    Number(totalPriceText.innerText.replace(/[^0-9]/g, "")) -
    originPrice +
    "원";
};

const productLi = document.querySelectorAll(".container.text-left.li");
const checkedLi = new Set();

checkAll.addEventListener("change", checkAllHandler);

productLi.forEach((el) => {
  const originPrice =
    Number(
      el.querySelector(".product-price").innerText.replace(/[^0-9]/g, "")
    ) / Number(el.querySelector(".quantity").innerText);

  el.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase-btn")) {
      increaseBtnHandler(el, originPrice);
    } else if (e.target.classList.contains("decrease-btn")) {
      decreaseBtnHandler(el, originPrice);
    } else if (e.target.classList.contains("form-check-input")) {
      if (e.target.checked) {
        checkedLi.add(e.target);
      } else {
        checkedLi.delete(e.target);
      }
    }
  });
});

removeProductBtn.addEventListener("click", () => {
  const nonCheckedProducts = cart.filter(({ orderItems }) => {
    const productName = orderItems.productName;
    return !Array.from(checkedLi).some(
      (input) => input.dataset.id == productName
    );
  });
  if (nonCheckedProducts.length >= 0) {
    localStorage.setItem("cart", JSON.stringify(nonCheckedProducts));
    location.reload();
  }
  totalPriceText.innerText = `${totalPrice + 3000}원`;
});

const purchaseBtnHandler = (e) => {
  const checkedProducts = cart.filter(({ orderItems }) => {
    const productName = orderItems.productName;
    return Array.from(checkedLi).some(
      (input) => input.dataset.id == productName
    );
  });
  console.log(checkedProducts);
  if (checkedProducts.length >= 1) {
    e.preventDefault();

    const itemArray = [];

    checkedProducts.forEach(({ orderItems }) => {
      let productItem = {
        productId: orderItems.productId,
        productName: orderItems.productName,
        price: orderItems.price,
        quantity: orderItems.quantity,
        discountRate: orderItems.discountRate,
      };
      itemArray.push(productItem);
    });

    localStorage.setItem("cart", JSON.stringify(checkedProducts));
    sessionStorage.setItem("validAccess", "toPayment");
    window.location.href = `/payment?order=${JSON.stringify(itemArray)}`;

    e.preventDefault();
  } else if (checkedProducts.length == 0) {
    alert("구매할 상품을 선택해주세요");
  }
  totalPriceText.innerText = `${totalPrice + 3000}원`;
};

const removeAllBtnHandler = () => {
  totalPriceText.innerText = `0원`;
  productAmount.innerText = `일반구매(0)`;
  localStorage.clear();
  document.querySelector(".container.text-left.cart-container").remove();
  totalPriceText.innerText = `${totalPrice + 3000}원`;
};

purchaseBtn.addEventListener("click", purchaseBtnHandler);
removeAllBtn.addEventListener("click", removeAllBtnHandler);
