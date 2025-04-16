// config.js
export const config = {
  apiUrl: './data.json',
  defaultSortKey: 'rollNo',
  filterKey: 'rank',
  pageSize: 40,
  columns: [
    { key: 'rollNo', label: 'Roll No', width: '80px', sortable: false, isFilterable: false },
    { key: 'name', label: 'Name', sortable: true, width: '150px', isFilterable: false },
    { key: 'age', label: 'Age', sortable: true, width: '100px', isFilterable: false },
    { key: 'rank', label: 'Rank', width: '120px', isFilterable: true }
  ],
  customRender: {
    name: (value) => {
      const strong = document.createElement('strong');
      strong.textContent = value;
      strong.style.color = '#4b5563'; 
      return strong;
    },
    age: (value) => {
      const span = document.createElement('span');
      span.textContent = value ? `${value} yrs` : '-';
      span.style.color = '#4b5563';
      return span;
    },
    rank: (value) => {
      const span = document.createElement('span');
      span.className = 'badge'; 
      span.textContent = value;
      return span;
    }
  }
};
