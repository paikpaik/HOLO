import * as Api from "./api.js";

const isLogin = sessionStorage.getItem("token");
let page;
let loginOut;
if (isLogin) {
  page = '<li><a href="/mypage">마이페이지</a></li>';
  loginOut = '<li><a href="/" class="logout">로그아웃</a></li>';
} else {
  page = '<li><a href="/register">회원가입</a></li>';
  loginOut = '<li><a href="/login">로그인</a></li>';
}
insertHeader();
insertFooter();
initEventListeners();

async function handleLogout() {
  try {
    const result = await Api.post("/api/users/logout");
    sessionStorage.removeItem("token");
    alert(result.message);
  } catch (err) {
    alert("로그인 상태가 아닙니다");
    sessionStorage.removeItem("token");
  }
}
function initEventListeners() {
  document.querySelector(".header").addEventListener("click", async (e) => {
    if (e.target.classList.contains("logout")) {
      e.preventDefault();
      await handleLogout();
      location.reload();
    }
  });
}
function insertHeader() {
  const header = `
    <header class="container header">
      <div class="top-header">
        <div class="header-logo">
        <a href="/"><img src="/images/holo_logo(1).png" href="/" alt="HOLO" width="120px" id="logo"></a>
        </div>
        <div class="header-menu">
          <ul>
            <li><a href="#">장바구니</a></li>
            ${page}
            ${loginOut}
          </ul>
        </div>
      </div>
      <nav class="navbar">
        <ul class="navbar-list">
          <li><a class="dropdown-item" href="/productList?categoryId=채소과일">채소·과일</a></li>
          <li><a class="dropdown-item" href="/productList?categoryId=정육계란">정육·계란</a></li>
          <li><a class="dropdown-item" href="/productList?categoryId=수산">수산</a></li> 
          <li><a class="dropdown-item" href="/productList?categoryId=샐러드간편식">샐러드·간편식</a></li>
          <li><a class="dropdown-item" href="/productList?categoryId=음료">음료</a></li>
        </ul>
      </nav>
    </header>`;

  document.querySelector("body").insertAdjacentHTML("afterbegin", header);
}

function insertFooter() {
  const footer = `
    <footer class="footer">
      <div class="footer-menu">
        <ul>
          <li><a href="#">회사소개</a></li>
          <li><a href="#">이용약관</a></li>
          <li><a href="#">개인정보처리방침</a></li>
          <li><a href="#">고객센터</a></li>
        </ul>
      </div>
      <div class="footer-info">
        <p>주소: 서울시 강남구 삼성동</p>
        <p>전화번호: 02-1234-5678</p>
        <p>이메일: contact@holo.com</p>
      </div>
    </footer>`;

  document.querySelector("body").insertAdjacentHTML("beforeend", footer);
}
