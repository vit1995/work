import "./app.min.js";
import "./watcher.min.js";
/* empty css        */
/* empty css              */
class BeforeAfter {
  constructor(props) {
    let defaultConfig = {
      init: true,
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    if (this.config.init) {
      const beforeAfterItems = document.querySelectorAll("[data-fls-beforeafter]");
      if (beforeAfterItems.length > 0) {
        this.setLogging(`Проснулся, вижу элементы: ${beforeAfterItems.length}`);
        this.beforeAfterInit(beforeAfterItems);
      }
    }
  }
  beforeAfterInit(beforeAfterItems) {
    beforeAfterItems.forEach((beforeAfter) => {
      if (beforeAfter) {
        this.beforeAfterItemInit(beforeAfter);
      }
    });
  }
  beforeAfterItemInit(beforeAfter) {
    const beforeAfterArrow = beforeAfter.querySelector("[data-fls-beforeafter-arrow]");
    const afterItem = beforeAfter.querySelector("[data-fls-beforeafter-after]");
    const beforeLabel = beforeAfter.querySelector(".before-after__label--before");
    const afterLabel = beforeAfter.querySelector(".before-after__label--after");
    if (!beforeAfterArrow || !afterItem) return;
    let isDragging = false;
    const updatePosition = (clientX) => {
      const rect = beforeAfter.getBoundingClientRect();
      let posX = clientX - rect.left;
      posX = Math.max(0, Math.min(posX, rect.width));
      const percent = posX / rect.width * 100;
      beforeAfterArrow.style.left = percent + "%";
      afterItem.style.width = 100 - percent + "%";
      if (beforeLabel) {
        beforeLabel.style.opacity = percent > 25 ? "1" : "0";
      }
      if (afterLabel) {
        afterLabel.style.opacity = percent < 75 ? "1" : "0";
      }
    };
    const startDragging = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const moveHandler = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const endDragging = () => {
      isDragging = false;
    };
    beforeAfter.addEventListener("mousedown", startDragging);
    beforeAfter.addEventListener("touchstart", startDragging, { passive: false });
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", endDragging);
    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("touchend", endDragging);
    beforeAfter.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
    updatePosition(beforeAfter.getBoundingClientRect().left + beforeAfter.offsetWidth / 2);
  }
  setLogging(message) {
    if (this.config.logging) {
      console.log(`[ДоПосле]: ${message}`);
    }
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new BeforeAfter({});
  });
} else {
  new BeforeAfter({});
}
(function() {
  const state = {
    step: 1,
    body: null,
    age: null,
    zones: []
  };
  const PRICES = {
    body: { sedan: 4e3, crossover: 5500, suv: 7e3, van: 7500, commercial: 1e4 },
    age: { new: 0.9, mid: 1, old: 1.3 },
    zone: { floor: 3500, cavity: 3e3, arch: 2500, film: 2e3 }
  };
  const NAMES = {
    sedan: "Седан",
    crossover: "Кроссовер",
    suv: "Внедорожник",
    van: "Минивэн / универсал",
    commercial: "Грузовой",
    new: "До 3 лет",
    mid: "3–7 лет",
    old: "Старше 7 лет",
    floor: "Днище",
    cavity: "Скрытые полости",
    arch: "Колёсные арки",
    film: "Антигравий"
  };
  function calcPrice() {
    const base = PRICES.body[state.body] || 4e3;
    const mult = PRICES.age[state.age] || 1;
    let price = base * mult;
    state.zones.forEach((z) => {
      price += PRICES.zone[z] || 0;
    });
    return Math.max(3e3, Math.round(price / 500) * 500);
  }
  function showStep(step) {
    const steps = document.querySelectorAll(".calc-step");
    steps.forEach((el) => {
      el.style.display = parseInt(el.dataset.step) === step ? "flex" : "none";
    });
    state.step = step;
    updateUI();
  }
  function fillHiddenFields() {
    const price = calcPrice();
    const bodyInput = document.getElementById("calc-input-body");
    const ageInput = document.getElementById("calc-input-age");
    const zonesInput = document.getElementById("calc-input-zones");
    const priceInput = document.getElementById("calc-input-price");
    const textInput = document.getElementById("calc-input-text");
    const bodyName = NAMES[state.body] || "—";
    const ageName = NAMES[state.age] || "—";
    const zonesName = state.zones.map((z) => NAMES[z]).join(", ") || "не выбраны";
    const priceText = "от " + price.toLocaleString("ru-RU") + " BYN";
    if (bodyInput) bodyInput.value = bodyName;
    if (ageInput) ageInput.value = ageName;
    if (zonesInput) zonesInput.value = zonesName;
    if (priceInput) priceInput.value = priceText;
    if (textInput) {
      textInput.value = "Расчёт калькулятора: тип кузова — " + bodyName + "; возраст — " + ageName + "; зоны обработки — " + zonesName + "; предварительная цена — " + priceText + ".";
    }
  }
  function updateUI() {
    const isResult = state.step === 4;
    const progress = document.getElementById("calc-progress");
    const stepLabel = document.getElementById("calc-step-label");
    const hint = document.getElementById("calc-hint");
    const prevBtn = document.getElementById("calc-prev");
    const nextBtn = document.getElementById("calc-next");
    if (progress) {
      progress.style.width = isResult ? "100%" : state.step / 3 * 100 + "%";
    }
    if (stepLabel) {
      stepLabel.textContent = isResult ? "Готово!" : "Шаг " + state.step + " из 3";
    }
    const labels = {
      1: "Выберите тип кузова",
      2: "Выберите возраст автомобиля",
      3: "Что обрабатываем? Можно несколько",
      4: "Ваш расчёт готов"
    };
    if (hint) hint.textContent = labels[state.step] || "";
    if (prevBtn) {
      prevBtn.style.visibility = state.step === 1 ? "hidden" : "visible";
    }
    if (nextBtn) {
      if (isResult) {
        nextBtn.style.display = "none";
      } else {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = 'Далее <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';
      }
    }
    if (isResult) {
      const price = calcPrice();
      const totalPrice = document.getElementById("calc-total-price");
      if (totalPrice) {
        totalPrice.textContent = "от " + price.toLocaleString("ru-RU") + " BYN";
      }
      const sumBody = document.getElementById("calc-summary-body");
      const sumAge = document.getElementById("calc-summary-age");
      const sumZones = document.getElementById("calc-summary-zones");
      if (sumBody) sumBody.textContent = NAMES[state.body] || "—";
      if (sumAge) sumAge.textContent = NAMES[state.age] || "—";
      if (sumZones) sumZones.textContent = state.zones.map((z) => NAMES[z]).join(", ") || "не выбраны";
      fillHiddenFields();
    }
  }
  function init() {
    const container = document.querySelector("[data-fls-calc]");
    if (!container) return;
    console.log("Калькулятор запущен");
    showStep(1);
    document.querySelectorAll(".calc-option").forEach((btn) => {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        const id = this.dataset.calcOpt;
        const currentStep = state.step;
        if (currentStep === 3) {
          this.classList.toggle("is-selected");
          const index = state.zones.indexOf(id);
          if (index >= 0) {
            state.zones.splice(index, 1);
          } else {
            state.zones.push(id);
          }
        } else {
          const parent = this.closest(".calc-options");
          parent.querySelectorAll(".calc-option").forEach((el) => el.classList.remove("is-selected"));
          this.classList.add("is-selected");
          if (currentStep === 1) {
            state.body = id;
          } else if (currentStep === 2) {
            state.age = id;
          }
        }
      });
    });
    const nextBtn = document.getElementById("calc-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", function() {
        const currentStep = state.step;
        if (currentStep === 1 && !state.body) {
          alert("Выберите тип кузова");
          return;
        }
        if (currentStep === 2 && !state.age) {
          alert("Выберите возраст автомобиля");
          return;
        }
        if (currentStep === 3 && state.zones.length === 0) {
          alert("Выберите хотя бы одну зону");
          return;
        }
        if (currentStep === 3) {
          showStep(4);
        } else {
          showStep(currentStep + 1);
        }
      });
    }
    const prevBtn = document.getElementById("calc-prev");
    if (prevBtn) {
      prevBtn.addEventListener("click", function() {
        if (state.step > 1) showStep(state.step - 1);
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
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
