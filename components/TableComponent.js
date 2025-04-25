import { CLASSES, ELEMENTS, MESSAGES } from '../utils/constants.js';
import { getSortedData } from '../utils/sorting.js';
import { renderHeader } from './Header.js';
import { renderBody } from './Body.js';
import { renderSearchBar } from '../utils/search.js';
import { showNoDataMessage, removeNoDataMessage } from '../utils/helpers.js';

export class TableComponent {
  constructor(config, data = []) {
    this.config = config;
    this.container = document.getElementById(ELEMENTS.CONTAINER);
    this.table = document.createElement(ELEMENTS.TABLE);
    this.table.classList.add(CLASSES.TABLE);
    this.sortState = {};
    this.data = data;

    const searchBar = renderSearchBar(container, this.handleTableSearch.bind(this))
    this.container.appendChild(searchBar);

    renderHeader(config, this.table, this.sortState, this.handleTableSort.bind(this), data,
      this.handleTableFilter.bind(this));
    renderBody(data, config, this.table, this.container);
    this.container.appendChild(this.table);

  }

  //sort
  handleTableSort(field, order) {
    const sorted = getSortedData(this.data, field, order)
    renderBody(sorted, this.config, this.table);
  }

  //filter
  handleTableFilter(field, value) {
    const filtered = value ? this.data.filter(item => item[field] === value) : this.data;
    renderBody(filtered, this.config, this.table)
  }

  //search
  handleTableSearch(searchValue) {
    const normalizedSearch = searchValue.trim().toLowerCase();
    removeNoDataMessage(this.container);
    if (!!normalizedSearch) {
      const filtered = this.data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().indexOf(normalizedSearch) !== -1
        )
      );
      if (filtered.length === 0) {
        renderBody([], this.config, this.table);
        showNoDataMessage(this.container, MESSAGES.NO_DATA);
      } else {
        renderBody(filtered, this.config, this.table);
      }
    } else {
      renderBody(this.data, this.config, this.table);
    }
  }

}
