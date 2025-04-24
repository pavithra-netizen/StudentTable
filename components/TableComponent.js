import { CLASSES, ELEMENTS } from '../utils/constants.js';
import { getSortedData } from '../utils/sorting.js';
import { renderHeader } from './Header.js';
import { renderRows } from './Rows.js';

export class TableComponent {
  constructor(config, container, data = []) {
    this.config = config;
    this.table = document.createElement(ELEMENTS.TABLE);
    this.table.classList.add(CLASSES.TABLE);
    this.sortState = {};
    this.data = data;

    renderHeader(config, this.table, this.sortState, this.sortAndRender.bind(this), data, this.filterAndRender.bind(this),);
    renderRows(data, config, this.table);
    container.appendChild(this.table);
  }

  sortAndRender(field, order) {
    const sorted = getSortedData(this.data, field, order)
    renderRows(sorted, this.config, this.table);
  }
  filterAndRender(field, value) {
    const filtered = value ? this.data.filter(item=> item[field] === value):this.data;
    renderRows(filtered,this.config,this.table)
  }
}
