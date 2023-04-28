import * as Api from "../api.js";

const tbodyEl = document.querySelector("tbody");

getUsers();

async function getUsers() {
  const usersObj = await Api.get("/api/admin/all-users");
  renderUsers(usersObj.users);
}

function renderUsers(users) {
  users.forEach((user) => {
    if (!user.isAdmin)
      tbodyEl.innerHTML += `
        <tr>
          <td>${user.userId}</td>
          <td>${user.name}</td>
          <td>${user.createDate?.split("T")[0]}</td>
          <td>
            <button class="btn btn-outline-success delete-btn" data-id="${
              user.userId
            }">삭제</button>
          </td>
        </tr>
      `;
  });
}

async function deleteUser(userId) {
  const result = await Api.delete(`/api/admin/delete-user/${userId}`);
  alert(result.message);
  location.reload();
}

tbodyEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const isDelete = confirm("정말 삭제하시겠습니까?");
    if (!isDelete) return;
    deleteUser(e.target.dataset.id);
  }
});
