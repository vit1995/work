import "./app.min.js";
/* empty css        */
/* empty css              */
document.addEventListener("DOMContentLoaded", function() {
  const points = document.querySelectorAll(".zones-block__point");
  const panels = document.querySelectorAll(".zones-block__panel");
  if (!points.length || !panels.length) {
    console.warn("Точки или панели не найдены");
    return;
  }
  function selectZone(id) {
    points.forEach((point) => {
      point.classList.toggle("is-active", point.dataset.zone === id);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-visible", panel.dataset.zonePanel === id);
    });
  }
  points.forEach((point) => {
    point.addEventListener("click", function() {
      selectZone(this.dataset.zone);
    });
  });
  if (points.length) {
    selectZone(points[0].dataset.zone);
  }
});
