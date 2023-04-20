insertHeader();
insertFooter();

function insertHeader() {
  const header = `
    <header class="header">
      <div class="top-header">
        <div class="header-logo">
          <a href="#home">HOLO</a>
        </div>
        <div class="header-menu">
          <ul>
            <li><a href="#">장바구니</a></li>
            <li><a href="#mypage">마이페이지</a></li>
            <li><a href="#logout">로그아웃</a></li>
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
