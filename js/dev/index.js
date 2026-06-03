import { g as getDigFormat, u as uniqArray } from "./app.min.js";
import "./slider.min.js";
import "./gallery.min.js";
import "./form.min.js";
import "./autoheight.min.js";
import "./qwiz.min.js";
/* empty css          */
/* empty css              */
/* empty css              */
function digitsCounter() {
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-fls-digcounter]");
    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter2) => {
        if (digitsCounter2.hasAttribute("data-fls-digcounter-go")) return;
        digitsCounter2.setAttribute("data-fls-digcounter-go", "");
        digitsCounter2.dataset.flsDigcounter = digitsCounter2.innerHTML;
        digitsCounter2.innerHTML = `0`;
        digitsCountersAnimate(digitsCounter2);
      });
    }
  }
  function digitsCountersAnimate(digitsCounter2) {
    let startTimestamp = null;
    const duration = parseFloat(digitsCounter2.dataset.flsDigcounterSpeed) ? parseFloat(digitsCounter2.dataset.flsDigcounterSpeed) : 1e3;
    const startValue = parseFloat(digitsCounter2.dataset.flsDigcounter);
    const format = digitsCounter2.dataset.flsDigcounterFormat ? digitsCounter2.dataset.flsDigcounterFormat : " ";
    const startPosition = 0;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (startPosition + startValue));
      digitsCounter2.innerHTML = typeof digitsCounter2.dataset.flsDigcounterFormat !== "undefined" ? getDigFormat(value, format) : value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        digitsCounter2.removeAttribute("data-fls-digcounter-go");
      }
    };
    window.requestAnimationFrame(step);
  }
  function digitsCounterAction(e) {
    const entry = e.detail.entry;
    const targetElement = entry.target;
    if (targetElement.querySelectorAll("[data-fls-digcounter]").length && !targetElement.querySelectorAll("[data-fls-watcher]").length && entry.isIntersecting) {
      digitsCountersInit(targetElement.querySelectorAll("[data-fls-digcounter]"));
    }
  }
  document.addEventListener("watcherCallback", digitsCounterAction);
}
document.querySelector("[data-fls-digcounter]") ? window.addEventListener("load", digitsCounter) : null;
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.hasAttribute("data-fls-watch") ? this.scrollWatcherRun() : null;
  }
  // Обновляем конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаем конструктор
  scrollWatcherRun() {
    document.documentElement.setAttribute("data-fls-watch", "");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  // Конструктор наблюдателей
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  // Функция создания настроек
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функция создания нового наблюдателя с вашими настройками
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функция инициализации наблюдателя с его настройками
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функция обработки базовых действий точек срабатывания
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функция отключения слежения за объектом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  // Функция обработки наблюдения
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
(function() {
  const marquee = () => {
    const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
    const ATTR_NAMES = {
      inner: "data-fls-marquee-inner",
      item: "data-fls-marquee-item"
    };
    if (!$marqueeArray.length) return;
    const { head } = document;
    const isFunction = (fn) => typeof fn === "function";
    const debounce = (delay, fn) => {
      let timerId;
      return (...args) => {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
          fn(...args);
          timerId = null;
        }, delay);
      };
    };
    const onWindowWidthResize = (cb) => {
      if (!cb || !isFunction(cb)) return;
      let prevWidth = 0;
      const handleResize = () => {
        const currentWidth = window.innerWidth;
        if (prevWidth !== currentWidth) {
          prevWidth = currentWidth;
          cb();
        }
      };
      window.addEventListener("resize", debounce(50, handleResize));
      handleResize();
    };
    const buildMarquee = (marqueeNode) => {
      if (!marqueeNode) return;
      const $marquee = marqueeNode;
      const $childElements = $marquee.children;
      if (!$childElements.length) return;
      Array.from($childElements).forEach(($childItem) => $childItem.setAttribute(ATTR_NAMES.item, ""));
      const htmlStructure = `<div ${ATTR_NAMES.inner}>${$marquee.innerHTML}</div>`;
      $marquee.innerHTML = htmlStructure;
    };
    const getElSize = ($el, isVertical) => {
      if (isVertical) return $el.offsetHeight;
      return $el.offsetWidth;
    };
    $marqueeArray.forEach(($wrapper) => {
      if (!$wrapper) return;
      buildMarquee($wrapper);
      const $marqueeInner = $wrapper.firstElementChild;
      let cacheArray = [];
      if (!$marqueeInner) return;
      const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
      const $items = $wrapper.querySelectorAll(`[${ATTR_NAMES.item}]`);
      const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
      const isMousePaused = $wrapper.hasAttribute("data-fls-marquee-pause-mouse-enter");
      const direction = $wrapper.getAttribute("data-fls-marquee-direction");
      const isVertical = direction === "bottom" || direction === "top";
      const animName = `marqueeAnimation-${Math.floor(Math.random() * 1e7)}`;
      let spaceBetweenItem = $items[0] ? parseFloat(window.getComputedStyle($items[0])?.getPropertyValue("margin-right")) : 0;
      let spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
      let startPosition = parseFloat($wrapper.getAttribute("data-fls-marquee-start")) || 0;
      let sumSize = 0;
      let firstScreenVisibleSize = 0;
      let initialSizeElements = 0;
      let initialElementsLength = $marqueeInner.children.length;
      let index = 0;
      let counterDuplicateElements = 0;
      const isRtl = window.stateRtl || document.documentElement.getAttribute("dir") === "rtl" || false;
      const initEvents = () => {
        if (startPosition) $marqueeInner.addEventListener("animationiteration", onChangeStartPosition);
        if (!isMousePaused) return;
        $marqueeInner.removeEventListener("mouseenter", onChangePaused);
        $marqueeInner.removeEventListener("mouseleave", onChangePaused);
        $marqueeInner.addEventListener("mouseenter", onChangePaused);
        $marqueeInner.addEventListener("mouseleave", onChangePaused);
      };
      const onChangeStartPosition = () => {
        startPosition = 0;
        $marqueeInner.removeEventListener("animationiteration", onChangeStartPosition);
        onResize();
      };
      const setBaseStyles = (firstScreenVisibleSize2) => {
        let baseStyle = "display: flex; flex-wrap: nowrap;";
        if (isVertical) {
          baseStyle += `flex-direction: column; position: relative; will-change: transform;`;
          if (direction === "bottom") baseStyle += `top: -${firstScreenVisibleSize2}px;`;
        } else {
          baseStyle += `position: relative; will-change: transform;`;
          if (direction === "right") baseStyle += `inset-inline-start: -${firstScreenVisibleSize2}px;`;
        }
        $marqueeInner.style.cssText = baseStyle;
      };
      const setdirectionAnim = (totalWidth) => {
        switch (direction) {
          case "right":
          case "bottom":
            return totalWidth;
          default:
            return -totalWidth;
        }
      };
      const animation = () => {
        const keyFrameCss = `@keyframes ${animName} {
					0% { transform: translate${isVertical ? "Y" : "X"}(${!isVertical && isRtl ? -startPosition : startPosition}%); }
					100% { transform: translate${isVertical ? "Y" : "X"}(${setdirectionAnim(!isVertical && isRtl ? -firstScreenVisibleSize : firstScreenVisibleSize)}px); }
				}`;
        const $style = document.createElement("style");
        $style.classList.add(animName);
        $style.innerHTML = keyFrameCss;
        head.append($style);
        $marqueeInner.style.animation = `${animName} ${(firstScreenVisibleSize + startPosition * firstScreenVisibleSize / 100) / speed}s infinite linear`;
      };
      const addDublicateElements = () => {
        sumSize = firstScreenVisibleSize = initialSizeElements = counterDuplicateElements = index = 0;
        const $parentNodeWidth = getElSize($wrapper, isVertical);
        let $childrenEl = Array.from($marqueeInner.children);
        if (!$childrenEl.length) return;
        if (!cacheArray.length) {
          cacheArray = $childrenEl.map(($item) => $item);
        } else {
          $childrenEl = [...cacheArray];
        }
        $marqueeInner.style.display = "flex";
        if (isVertical) $marqueeInner.style.flexDirection = "column";
        $marqueeInner.innerHTML = "";
        $childrenEl.forEach(($item) => $marqueeInner.append($item));
        $childrenEl.forEach(($item) => {
          if (isVertical) {
            $item.style.marginBottom = `${spaceBetween}px`;
          } else {
            $item.style.marginRight = `${spaceBetween}px`;
            $item.style.flexShrink = 0;
          }
          const sizeEl = getElSize($item, isVertical);
          sumSize += sizeEl + spaceBetween;
          firstScreenVisibleSize += sizeEl + spaceBetween;
          initialSizeElements += sizeEl + spaceBetween;
          counterDuplicateElements += 1;
        });
        const $multiplyWidth = $parentNodeWidth * 2 + initialSizeElements;
        for (; sumSize < $multiplyWidth; index += 1) {
          if (!$childrenEl[index]) index = 0;
          const $cloneNone = $childrenEl[index].cloneNode(true);
          const $lastElement = $marqueeInner.children[index];
          $marqueeInner.append($cloneNone);
          sumSize += getElSize($lastElement, isVertical) + spaceBetween;
          if (firstScreenVisibleSize < $parentNodeWidth || counterDuplicateElements % initialElementsLength !== 0) {
            counterDuplicateElements += 1;
            firstScreenVisibleSize += getElSize($lastElement, isVertical) + spaceBetween;
          }
        }
        setBaseStyles(firstScreenVisibleSize);
      };
      const correctSpaceBetween = () => {
        if (spaceBetweenItem && $items[0]) {
          $items.forEach(($item) => $item.style.removeProperty("margin-right"));
          spaceBetweenItem = parseFloat(window.getComputedStyle($items[0]).getPropertyValue("margin-right"));
          spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
        }
      };
      const init = () => {
        correctSpaceBetween();
        addDublicateElements();
        animation();
        initEvents();
      };
      const onResize = () => {
        head.querySelector(`.${animName}`)?.remove();
        init();
      };
      const onChangePaused = (e) => {
        const { type, target } = e;
        target.style.animationPlayState = type === "mouseenter" ? "paused" : "running";
      };
      onWindowWidthResize(onResize);
      init();
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", marquee);
  } else {
    marquee();
  }
  window.addEventListener("load", marquee);
  setTimeout(marquee, 500);
})();
