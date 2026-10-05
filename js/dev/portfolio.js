import "./app.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".portfolio-filters__btn");
  const items = document.querySelectorAll(".portfolio-gallery__item");
  const loadMoreBtn = document.getElementById("load-more");
  const loadMoreWrap = document.querySelector(".portfolio-gallery__load-more");
  let currentFilter = "all";
  let visibleCount = 12;
  const itemsPerPage = 8;
  function getVisibleItems() {
    return Array.from(items).filter((item) => !item.classList.contains("hidden"));
  }
  function updateVisibility() {
    const visibleItems = getVisibleItems();
    visibleItems.forEach((item, index) => {
      if (index < visibleCount) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
    if (visibleItems.length <= visibleCount) {
      loadMoreWrap.style.display = "none";
    } else {
      loadMoreWrap.style.display = "flex";
    }
  }
  function resetVisibleCount() {
    visibleCount = 12;
  }
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      items.forEach((item) => {
        if (currentFilter === "all" || item.dataset.category === currentFilter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
      resetVisibleCount();
      updateVisibility();
      setTimeout(() => {
        items.forEach((item) => {
          if (!item.classList.contains("hidden") && item.style.display !== "none") {
            item.style.animation = "none";
            item.offsetHeight;
            item.style.animation = "";
          }
        });
      }, 50);
    });
  });
  loadMoreBtn.addEventListener("click", () => {
    const visibleItems = getVisibleItems();
    const startIndex = visibleCount;
    visibleCount += itemsPerPage;
    if (visibleCount > visibleItems.length) {
      visibleCount = visibleItems.length;
    }
    for (let i = startIndex; i < visibleCount && i < visibleItems.length; i++) {
      const item = visibleItems[i];
      item.style.display = "";
      item.style.animation = "none";
      item.offsetHeight;
      item.style.animation = `portfolioFadeIn 0.4s ease forwards`;
      item.style.animationDelay = `${(i - startIndex) * 0.08}s`;
    }
    if (visibleCount >= visibleItems.length) {
      loadMoreWrap.style.display = "none";
    }
  });
  updateVisibility();
  const lightbox = document.createElement("div");
  lightbox.className = "portfolio-lightbox";
  lightbox.innerHTML = `
        <button class="portfolio-lightbox__close">✕</button>
        <button class="portfolio-lightbox__nav prev">‹</button>
        <button class="portfolio-lightbox__nav next">›</button>
        <div class="portfolio-lightbox__content">
            <img src="" alt="Просмотр фото" />
        </div>
    `;
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".portfolio-lightbox__close");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");
  let currentIndex = 0;
  let galleryItems = [];
  document.querySelectorAll(".portfolio-gallery__link[data-lightbox]").forEach((link) => {
    galleryItems.push(link);
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = galleryItems.indexOf(link);
      openLightbox(link.href);
    });
  });
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }
  function navigateLightbox(direction) {
    let newIndex = currentIndex + direction;
    while (newIndex >= 0 && newIndex < galleryItems.length && galleryItems[newIndex].closest(".portfolio-gallery__item")?.classList.contains("hidden")) {
      newIndex += direction;
    }
    if (newIndex >= 0 && newIndex < galleryItems.length && !galleryItems[newIndex].closest(".portfolio-gallery__item")?.classList.contains("hidden")) {
      currentIndex = newIndex;
      openLightbox(galleryItems[currentIndex].href);
    }
  }
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => navigateLightbox(-1));
  nextBtn.addEventListener("click", () => navigateLightbox(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
});
