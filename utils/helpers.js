import { CLASSES, ELEMENTS, MESSAGES } from "./constants.js";

export function showNoDataMessage(container, message) {
  // Check if there's an existing "No Data" message
  const existingMessage = container.querySelector('.no-data-message');

  if (existingMessage) {
    existingMessage.textContent = message; // Update message if already present
  } else {
    const noDataMessage = document.createElement(ELEMENTS.DIV);
    noDataMessage.classList.add(CLASSES.NO_DATA_MESSAGE);
    noDataMessage.textContent = message;
    container.appendChild(noDataMessage);
  }
}

export function removeNoDataMessage(container) {
  const existingMessage = container.querySelector('.no-data-message');
  if (existingMessage) {
    existingMessage.remove();
  }
}

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



export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    // console.log(timer,...args,"pppp")=> 8 'alice' 
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
