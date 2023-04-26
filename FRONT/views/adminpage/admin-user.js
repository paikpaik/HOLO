const allCheckBtn = document.querySelector(".btn-select-all");
const allCheckBtnIcon = document.querySelector(".btn-select-all i");
const checkBtnIcons = document.querySelectorAll(".form-check i");
const checkBtns = document.querySelectorAll(".form-check .btn-select");
const labels = document.querySelectorAll(".form-check label");

const deleteButtons = document.querySelectorAll(".btn-outline-success");

function deleteUser(e) {
  const button = e.target;
  const id = button.getAttribute("data-id");

  // 사용자 정보 삭제 코드 작성
  console.log(`삭제 버튼이 눌린 사용자 ID: ${id}`);
}

deleteButtons.forEach((button) => {
  button.addEventListener("click", deleteUser);
});
s;

// 새로운 회원 추가하기
function addUser(id, name, totalAmount, joinDate) {
  const userList = document.querySelector("#userList tbody");
  const row = document.createElement("tr");
  const deleteBtn = document.createElement("button");

  // data-id 속성 자동 할당
  row.setAttribute("data-id", id);

  row.innerHTML = `
    <td>${id}</td>
    <td>${name}</td>
    <td>${totalAmount}</td>
    <td>${joinDate}</td>
    <td>
      <button type="button" class="btn btn-outline-success">
        삭제
      </button>
    </td>
  `;

  deleteBtn.addEventListener("click", deleteUser);

  row.querySelector("button").appendChild(deleteBtn);
  userList.appendChild(row);
}
