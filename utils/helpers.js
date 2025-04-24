import { CLASSES, ELEMENTS, MESSAGES } from "./constants.js";

export const showNoDataMessage = (() => {
 
  function render(container, message) {
    const existingMessage = container.querySelector('.no-data-message');

    if (existingMessage) {
      existingMessage.textContent = message;
    } else {
      const noDataMessage = document.createElement(ELEMENTS.DIV);
      noDataMessage.classList.add(CLASSES.NO_DATA_MESSAGE);
      noDataMessage.textContent = message;
      container.appendChild(noDataMessage);
    }
  }

  return {
    noData: (container) => render(container, MESSAGES.NO_DATA),
    error: (container) => render(container, MESSAGES.ERROR_LOADING),
  };
})();


export function throttle(fn, delay) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
}