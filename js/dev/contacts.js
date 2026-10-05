import "./app.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector('[data-toggle="details"]');
  const content = document.querySelector('[data-content="details"]');
  if (toggle && content) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !isOpen);
      content.setAttribute("data-open", !isOpen);
    });
  }
});
