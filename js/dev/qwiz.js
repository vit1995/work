const budgetRange = document.getElementById("budgetRange");
const budgetValue = document.getElementById("budgetValue");
if (budgetRange && budgetValue) {
  budgetRange.addEventListener("input", () => {
    const value = parseInt(budgetRange.value).toLocaleString("ru-RU");
    budgetValue.textContent = value;
  });
}
const swiper = document.querySelector(".calculator__slider .swiper");
if (swiper) {
  swiper.addEventListener("slideChange", () => {
    const activeIndex = swiper.swiper?.activeIndex || 0;
    const totalSlides = swiper.swiper?.slides.length || 4;
    const progress = (activeIndex + 1) / totalSlides * 100;
    const progressBar = document.querySelector(".calculator__progress-bar span");
    const progressText = document.querySelector(".calculator__progress-text");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    if (progressText) {
      progressText.textContent = `Шаг ${activeIndex + 1} из ${totalSlides}`;
    }
  });
}
