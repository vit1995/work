import "./app.min.js";
import "./tabs.min.js";
/* empty css          */
/* empty css              */
document.querySelectorAll(".hub__card-more").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const card = btn.closest(".hub__card");
    card.classList.toggle("open");
    btn.textContent = card.classList.contains("open") ? "Скрыть ↑" : "Читать →";
  });
});
