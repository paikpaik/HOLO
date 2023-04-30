import * as Api from "../api.js";
const allCheckBtn = document.querySelector(".btn-select-all");
const allCheckBtnIcon = document.querySelector(".btn-select-all i");

const labels = document.querySelectorAll(".form-check label");
const productListContainer = document.querySelector(".product-list");

if (!sessionStorage.getItem("isAdmin")) {
  location.href = "/";
}
const products = await getProducts();
async function getProducts() {
  try {
    const products = await Api.get("/api/products/all");
    renderProducts(products);
  } catch (e) {
    alert(e.message);
  }
}

function renderProducts(products) {
  productListContainer.innerHTML = "";
  products.forEach((product) => {
    const {
      _id,
      imagePaths,
      productName,
      purchaseNum,
      category,
      price,
      stock,
      discountRate,
    } = product;
    productListContainer.innerHTML += `

  <div class="product-container">

  <div class="order-item shadow-sm p-3 bg-body-tertiary rounded">
    <div class="product-info">
      <div class="product-img">
         <img src=../../${imagePaths[0]} alt="${productName} 이미지" /> 
      </div>
      <div class="product-detail">
        <h4 >${productName}</h4>
        <p>상품 가격 ${price}원</p> 
        <p>할인율 ${discountRate}%</p>
        <p>재고 ${stock}</p>
        <p>구매수 ${purchaseNum}</p>
      </div>
    </div>

    <div class="order-item-btn-container">
      <button type="button" class="btn btn-outline-success btn-modify" data-id="${_id}">
        수정
      </button>
      <button type="button" class="btn btn-outline-success btn-delete" data-id="${_id}" >
        삭제
      </button>
    </div>
  </div>
</div>`;
  });
}

const productContainers = document.querySelectorAll(".product-container");
const checkBtnIcons = document.querySelectorAll(".form-check i");
const checkBtns = document.querySelectorAll(".form-check .btn-select");

// 전체 선택 버튼 클릭 이벤트
// allCheckBtn.addEventListener("click", handleAllCheck);

productContainers.forEach((productContainer) => {
  productContainer.addEventListener("click", handleCheck);
});

// 개별 상품 선택 버튼 클릭 이벤트
function handleCheck(e) {
  if (e.target.classList.contains("btn-delete")) {
    const productId = e.target.dataset.id;
    const isDelete = confirm("정말 삭제하시겠습니까?");
    if (isDelete) {
      deleteProduct(productId);
    }
  }
  // if (e.target.checked) {
  //   e.target.nextElementSibling.querySelector("i").className =
  //     "bi bi-check-circle-fill fs-4";
  // } else {
  //   e.target.nextElementSibling.querySelector("i").className =
  //     "bi bi-check-circle fs-4";
  // }
  // if (document.querySelectorAll(".form-check input:checked").length === 0) {
  //   allCheckBtnIcon.className = "bi bi-check-circle fs-4";
  // }
}

async function deleteProduct(productId) {
  try {
    await Api.delete(`/api/products/admin/${productId}`);
    location.reload();
  } catch (e) {
    alert(e.message);
  }
}

// 상품 등록 버튼 클릭 이벤트
const modalContent = document.querySelector(".modal-content");
modalContent.addEventListener("click", handleModalContent);

function handleModalContent(e) {
  if (e.target.classList.contains("btn-add")) {
    const formData = new FormData();
    const productName = document.querySelector("#productName").value;
    const price = document.querySelector("#price").value;
    const discountRate = document.querySelector("#discountRate").value;
    const stock = document.querySelector("#stock").value;
    const category = document.querySelector("#category").value;
    const longDesc = document.querySelector("#longDesc").value;
    const shortDesc = document.querySelector("#shortDesc").value;
    console.log(
      productName,
      price,
      discountRate,
      stock,
      category,
      longDesc,
      shortDesc
    );
    // const productImg = document.querySelector("#productImg").files[0];
    // const detailImg = document.querySelector("#productDetailImg").files[0];
    // const imagePaths = [productImg, detailImg];

    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("discountRate", discountRate);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("longDesc", longDesc);
    formData.append("shortDesc", shortDesc);
    formData.append("purchaseNum", 0);
    // formData.append("imagePaths", imagePaths);

    registerProduct(formData);
  }
}

async function registerProduct(formData) {
  try {
    const res = await fetch("/api/products/admin", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    console.log(res);
  } catch (e) {
    alert(e.message);
  }
}
