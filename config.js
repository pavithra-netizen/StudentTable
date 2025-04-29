import { CLASSES, ELEMENTS } from "./utils/constants.js";

export const config = {
  columns: [
    {
      key: 'rollNo',
      label: 'Roll No',
      width: '20%',
      minWidth: '100px',
      maxWidth: '150px',
      isSortable: false,
      isFilterable: false
    },
    {
      key: 'name',
      label: 'Name',
      width: '25%',
      minWidth: '150px',
      maxWidth: '250px',
      isSortable: true,
      isFilterable: false
    },
    {
      key: 'age',
      label: 'Age',
      width: '20%',
      minWidth: '80px',
      maxWidth: '120px',
      isSortable: true,
      isFilterable: false
    },
    {
      key: 'rank',
      label: 'Rank',
      width: '25%',
      minWidth: '100px',
      maxWidth: '200px',
      isSortable: false,
      isFilterable: true
    }
  ],

  tableDataCustomRenderer: {
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
