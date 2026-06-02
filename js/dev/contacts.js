import "./app.min.js";
import "./autoheight.min.js";
const detailsToggle = document.querySelector(".contacts__details-toggle");
const detailsContent = document.querySelector(".contacts__details-content");
if (detailsToggle && detailsContent) {
  detailsToggle.addEventListener("click", () => {
    detailsToggle.classList.toggle("open");
    detailsContent.classList.toggle("show");
  });
}
