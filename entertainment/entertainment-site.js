(() => {
  "use strict";
  const button = document.querySelector(".ent-header .menu-button");
  const nav = document.querySelector(".ent-header .global-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.querySelector(".sr-only").textContent = open ? "メニューを開く" : "メニューを閉じる";
    nav.classList.toggle("is-open", !open);
  });
})();
