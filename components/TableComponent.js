import { CLASSES, ELEMENTS } from '../utils/constants.js';
import { getSortedData } from '../utils/sorting.js';
import { renderHeader } from './Header.js';
import { renderBody } from './Body.js';

export class TableComponent {
  constructor(config, data = []) {
    this.config = config;
    this.container = document.getElementById(ELEMENTS.CONTAINER);
    this.table = document.createElement(ELEMENTS.TABLE);
    this.table.classList.add(CLASSES.TABLE);
    this.sortState = {};
    this.data = data;
  
    renderHeader(config, this.table, this.sortState, this.handleTableSort.bind(this), data, this.handleTableFilter.bind(this));
    renderBody(data, config, this.table);
    this.container.appendChild(this.table);
  }

  handleTableSort(field, order) {
    const sorted = getSortedData(this.data, field, order)
    renderBody(sorted, this.config, this.table);
  }
  handleTableFilter(field, value) {
    const filtered = value ? this.data.filter(item=> item[field] === value):this.data;
    renderBody(filtered,this.config,this.table)
  }
}
