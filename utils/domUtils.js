export function createElement(tag, options = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => (el[key] = value));
    [].concat(children).forEach(child =>
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child)
    );
    return el;
  }
  
  export function clearElementContent(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }
  
  export function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  
  export function throttle(fn, limit = 200) {
    let waiting = false;
    return (...args) => {
      if (!waiting) {
        fn.apply(this, args);
        waiting = true;
        setTimeout(() => (waiting = false), limit);
      }
    };
  }
  