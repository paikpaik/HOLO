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
    <header class="header">
      <div class="top-header">
        <div class="header-logo">
          <img src="/images/holo_logo(1).png" href="/" alt="HOLO" width="200px">
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
          <li class="category-menu dropdown" >
            <div class="dropdown-toggle" id="dropdownMenu" aria-expanded="false">
              <i class="bi bi-list"></i>
              <p>카테고리</p> 
            </div>  
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
              <li><a class="dropdown-item" href="#">카테고리1</a></li>
              <li><a class="dropdown-item" href="#">카테고리2</a></li>
              <li><a class="dropdown-item" href="#">카테고리3</a></li>  
            </ul>
          </li>
          <li><a href="#best">인기 상품</a></li>
          <li><a href="#discount">할인 상품</a></li>
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
