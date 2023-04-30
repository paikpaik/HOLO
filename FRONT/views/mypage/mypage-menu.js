const navMenu = document.querySelector(".mypage-navbar");
let selectedMenu = navMenu.querySelector(".active");

navMenu.addEventListener("click", (e) => {
  if (selectedMenu) {
    selectedMenu.classList.remove("active");
  }
  selectedMenu = e.target;
  selectedMenu.classList.add("active");
});
