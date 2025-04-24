import { CLASSES, ELEMENTS } from "./utils/constants.js";

export const config = {
  columns: [
    { key: 'rollNo', label: 'Roll No', width: '80px', sortable: false, isFilterable: false },
    { key: 'name', label: 'Name', sortable: true, width: '150px', isFilterable: false },
    { key: 'age', label: 'Age', sortable: true, width: '100px', isFilterable: false },
    { key: 'rank', label: 'Rank', width: '120px', isFilterable: true }
  ],
  sortIcons: {
    asc: '↑',
    desc: '↓',
    neutral: '⇅'
  },
  
  customRender: {
    name: (value) => {
      const div = document.createElement(ELEMENTS.DIV);
      div.classList.add(CLASSES.NAME_CONTAINER);

      const nameText = document.createElement(ELEMENTS.SPAN);
      nameText.textContent = value;
      nameText.classList.add(CLASSES.NAME_TEXT); 
      div.appendChild(nameText);
      return div;
    },
  
    age: (value) => {
      const span = document.createElement(ELEMENTS.SPAN);
      span.textContent = value ? `${value} yrs` : '-';
      span.classList.add(CLASSES.AGE_TEXT); 
      return span;
    },
  
    rank: (value) => {
      const span = document.createElement(ELEMENTS.SPAN);
      span.textContent = value;
      span.classList.add(CLASSES.RANK_BADGE);
      span.setAttribute('data-rank', value.toUpperCase());
      return span;
    }
  } 
  
};
