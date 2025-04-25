import { CLASSES, ELEMENTS, EVENTS, TEXT } from './constants.js';
import { debounce } from './helpers.js';

export function renderSearchBar(container, onSearch) {
  // Wrapper
  const wrapper = document.createElement(ELEMENTS.DIV);
  wrapper.classList.add(CLASSES.SEARCH_WRAPPER);

  // Input
  const input = document.createElement(ELEMENTS.INPUT);
  input.classList.add(CLASSES.SEARCH_INPUT);
  input.placeholder = TEXT.PLACEHOLDERS.SEARCH

  // Clear button 
  const clearBtn = document.createElement(ELEMENTS.SPAN);
  clearBtn.classList.add(CLASSES.SEARCH_CLEAR);
  clearBtn.textContent = '❌';

  // Events
  const handleSearch = debounce((value) => {
    onSearch(value);
  }, 300);

  input.addEventListener(EVENTS.INPUT, (e) => {
    const value = e.target.value.trim().toLowerCase();
    clearBtn.classList.toggle(CLASSES.VISIBLE, value !== '');
    handleSearch(value);
  });

  clearBtn.addEventListener(EVENTS.CLICK, () => {
    input.value = '';
    clearBtn.classList.remove(CLASSES.VISIBLE);
    handleSearch('');
  });

  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);
  return wrapper;
}
