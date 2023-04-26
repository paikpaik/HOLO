const allCheckBtn = document.querySelector(".btn-select-all");
const allCheckBtnIcon = document.querySelector(".btn-select-all i");
const checkBtnIcons = document.querySelectorAll(".form-check i");
const checkBtns = document.querySelectorAll(".form-check .btn-select");
const labels = document.querySelectorAll(".form-check label");

// 전체 선택 버튼 클릭 이벤트
allCheckBtn.addEventListener("click", handleAllCheck);

checkBtns.forEach((checkBtn) => {
  checkBtn.addEventListener("click", handleCheck);
});

async function handleAllCheck(e) {
  if (allCheckBtnIcon.className.split(" ")[1] === "bi-check-circle") {
    allCheckBtnIcon.className = "bi bi-check-circle-fill fs-4";
  } else {
    allCheckBtnIcon.className = "bi bi-check-circle fs-4";
  }

  checkBtnIcons.forEach((checkBtnIcon) => {
    if (allCheckBtnIcon.className.split(" ")[1] === "bi-check-circle-fill") {
      checkBtnIcon.className = "bi bi-check-circle-fill fs-4";
    } else {
      checkBtnIcon.className = "bi bi-check-circle fs-4";
    }
  });
}

// 개별 상품 선택 버튼 클릭 이벤트
function handleCheck(e) {
  if (e.target.checked) {
    e.target.nextElementSibling.querySelector("i").className =
      "bi bi-check-circle-fill fs-4";
  } else {
    e.target.nextElementSibling.querySelector("i").className =
      "bi bi-check-circle fs-4";
  }
  if (document.querySelectorAll(".form-check input:checked").length === 0) {
    allCheckBtnIcon.className = "bi bi-check-circle fs-4";
  }
}
