import { createElement, clearElementContent, debounce, throttle } from '../utils/domUtils.js';
import { sortByKey, filterByKey, uniqueValues } from '../utils/helpers.js';

export class TableComponent {
  constructor(config, fetchData, parentElement) {
    Object.assign(this, {
      config,
      fetchData,
      parentElement,
      allRows: [],
      visibleRows: [],
      sortKey: config.defaultSortKey || null,
      sortOrder: 'asc',
      selectedFilterValue: 'All',
      isLoading: false,
      rowHeight: null,
      buffer: 5,
      visibleLimit: 40,
      fallbackRowHeight: 48  // <-- Fallback height here
    });
    this.setupTable();
    this.scrollArea.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    this.init();
  }

  setupTable() {
    const title = createElement('h2', { textContent: this.config.title || 'Table' });
    title.classList.add('table-heading');

    this.resetButton = createElement('button', {
      textContent: 'Reset',
      onclick: () => this.resetTable()
    });
    this.resetButton.classList.add('reset-btn');

    const topBar = createElement('div', {}, [title, this.resetButton]);
    topBar.classList.add('table-toolbar');

    this.table = createElement('table');
    this.table.classList.add('custom-table');

    this.header = createElement('thead');
    this.body = createElement('tbody');
    this.table.append(this.header, this.body);

    this.spacer = createElement('div');
    this.spacer.classList.add('virtual-spacer');

    this.loadingWrapper = createElement('div', {}, [createElement('div')]);
    this.loadingWrapper.classList.add('spinner-wrapper');
    this.loadingWrapper.firstChild.classList.add('spinner');

    const tableWrapper = createElement('div', {}, [this.spacer, this.table, this.loadingWrapper]);
    
    this.scrollArea = createElement('div', {}, [tableWrapper]);
    this.scrollArea.classList.add('scroll-container');

    this.parentElement.append(topBar, this.scrollArea);
  }

  renderHeader() {
    clearElementContent(this.header);
    const headerRow = createElement('tr');

    this.config.columns.forEach(col => {
      let th;

      if (this.config.filterKey === col.key && col.isFilterable) {
        const dropdown = createElement('select', {}, [
          ...['All', ...uniqueValues(this.allRows, col.key)].map(value =>
            createElement('option', { value, textContent: value })
          )
        ]);
        dropdown.value = this.selectedFilterValue;
        dropdown.onchange = debounce(e => {
          this.selectedFilterValue = e.target.value;
          this.render(true);
        });
        dropdown.classList.add('filter-dropdown');

        const label = createElement('label', {}, [col.label + ' ', dropdown]);
        label.classList.add('filter-label');
        th = createElement('th', {}, [label]);
      } else if (col.sortable && col.key !== this.config.nonSortableKey) {
        const icon = this.sortKey === col.key ? (this.sortOrder === 'asc' ? '↑' : '↓') : '⇅';
        const button = createElement('button', {
          textContent: `${col.label} ${icon}`,
          onclick: () => {
            this.sortOrder = this.sortKey === col.key && this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.sortKey = col.key;
            this.render(true);
          }
        });
        button.classList.add('sort-btn');
        th = createElement('th', {}, [button]);
      } else {
        th = createElement('th', { textContent: col.label });
      }

      headerRow.appendChild(th);
    });

    this.header.appendChild(headerRow);
  }

  renderRows(from, to) {
    clearElementContent(this.body);
    const end = Math.min(from + this.visibleLimit, to);

    if (this.visibleRows.length === 0) {
      const tr = createElement('tr');
      const td = createElement('td', { textContent: 'No data available' });
      td.colSpan = this.config.columns.length;
      td.classList.add('no-data');
      tr.appendChild(td);
      this.body.appendChild(tr);
    } else {
      for (let i = from; i < end; i++) {
        const rowData = this.visibleRows[i];
        if (!rowData) continue;

        const tr = createElement('tr');
        this.config.columns.forEach(col => {
          const td = createElement('td');
          const customRender = this.config.customRender?.[col.key];
          td.append(customRender ? customRender(rowData[col.key], rowData) : document.createTextNode(rowData[col.key] ?? '-'));
          tr.appendChild(td);
        });
        this.body.appendChild(tr);
      }
    }

    const top = from * (this.rowHeight || this.fallbackRowHeight);
    this.body.style.transform = `translateY(${top}px)`;
  }

  handleScroll() {
    const topScroll = this.scrollArea.scrollTop;
    const effectiveHeight = this.rowHeight || this.fallbackRowHeight;
    const startIndex = Math.floor(topScroll / effectiveHeight);
    const count = Math.ceil(this.scrollArea.clientHeight / effectiveHeight);
    const from = Math.max(0, startIndex - this.buffer);
    const to = Math.min(this.visibleRows.length, startIndex + count + this.buffer);

    this.renderRows(from, to);
  }

  render(reset = false) {
    let data = [...this.allRows];

    if (this.config.filterKey && this.selectedFilterValue !== 'All') {
      data = filterByKey(data, this.config.filterKey, this.selectedFilterValue);
    }

    data = sortByKey(data, this.sortKey, this.sortOrder);
    this.visibleRows = data;

    if (this.rowHeight === null && this.visibleRows.length > 0) {
      const tempRow = createElement('tr');
      this.config.columns.forEach(() => {
        const td = createElement('td');
        td.textContent = '-';
        tempRow.appendChild(td);
      });
      this.body.appendChild(tempRow);
      this.rowHeight = tempRow.offsetHeight || this.fallbackRowHeight;
      this.body.removeChild(tempRow);
    }

    const totalHeight = this.visibleRows.length * (this.rowHeight || this.fallbackRowHeight);
    this.spacer.style.height = `${totalHeight}px`; //  Updated spacer height logic

    this.renderHeader();
    this.handleScroll();
    this.hideLoader();
    this.isLoading = false;
  }

  showLoader() {
    this.loadingWrapper.style.display = 'flex';
  }

  hideLoader() {
    this.loadingWrapper.style.display = 'none';
  }

  resetTable() {
    this.selectedFilterValue = 'All';
    this.sortKey = this.config.defaultSortKey || null;
    this.sortOrder = 'asc';
    this.render(true);
  }

  async init() {
    try {
      this.showLoader();
      this.allRows = await this.fetchData();
      this.render(true);
    } catch (error) {
      const td = createElement('td', {
        colSpan: this.config.columns.length
      }, [error.message]);
      td.classList.add('error');
      this.body.appendChild(createElement('tr', {}, [td]));
    } finally {
      this.hideLoader();
    }
  }
}
