const navMenu = document.querySelectorAll("nav a");

navMenu.forEach((menu) => {
  menu.addEventListener("click", (e) => {
    const active = document.querySelector("nav a.active");
    if (active) {
      active.classList.remove("active");
    }
    e.target.classList.add("active");
  });
});
