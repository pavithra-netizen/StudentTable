import { CLASSES, ELEMENTS, MESSAGES } from './constants.js';
import { getSortedData } from '../../utils/sorting.js';
import { renderHeader } from '../Header.js';
import { renderBody } from '../Body.js';
// import { renderSearchBar } from '../../utils/search.js';
import { showNoDataMessage, removeNoDataMessage, createLoader, removeLoader } from '../../utils/helpers.js';

export class TableComponent {
  constructor(config, fetchDataFn) {
    this.config = config;
    this.fetchDataFn = fetchDataFn;
    this.container = document.getElementById(ELEMENTS.CONTAINER);
    this.table = document.createElement(ELEMENTS.TABLE);
    this.table.classList.add(CLASSES.TABLE);
    this.sortState = {};
    this.init()
  }

  async init() {
    const loader = createLoader();
    this.container.appendChild(loader);

    try {
      const data = await this.fetchDataFn();
      this.data = data;

      removeLoader(this.container, loader);

      // const searchBar = renderSearchBar(this.handleTableSearch);
      // this.container.appendChild(searchBar);

      renderHeader(this.config, this.table, this.sortState, this.handleTableSort, data, this.handleTableFilter, this.handleTableSearch);
      renderBody(data, this.config, this.table, this.container);
      this.container.appendChild(this.table);

      if (data.length === 0) {
        showNoDataMessage(this.container, MESSAGES.NO_DATA);
      }
    } catch (error) {
      removeLoader(this.container, loader);
      showNoDataMessage(this.container, MESSAGES.ERROR_LOADING);
    }
  }

  //sort
  handleTableSort = (field, order) => {
    const sorted = getSortedData(this.data, field, order)
    renderBody(sorted, this.config, this.table);
  }

  //filter
  handleTableFilter = (field, value) => {
    const filtered = value ? this.data.filter(item => item[field] === value) : this.data;
    renderBody(filtered, this.config, this.table)
  }

  //search
  handleTableSearch = (searchValue) => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    removeNoDataMessage(this.container);

    if (normalizedSearch.length > 0) {
      const filtered = this.data.filter(row => {
        return this.config.columns.some(column => {
          if (column.isSearchable) {
            const cellValue = row[column.key];
            return String(cellValue).toLowerCase().includes(normalizedSearch);
          }
          return false;
        });
      });

      if (filtered.length === 0) {
        renderBody([], this.config, this.table);
        showNoDataMessage(this.container, MESSAGES.NO_DATA);
      } else {
        renderBody(filtered, this.config, this.table);
      }
    } else {
      renderBody(this.data, this.config, this.table);  // Show original data if search term is empty
    }
  };


}
