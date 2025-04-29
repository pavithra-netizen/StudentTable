import { TableComponent } from './components/TableComponent.js';
import { createLoader, removeLoader, showNoDataMessage } from './utils/helpers.js';
import { config } from './config.js';
import { fetchData } from './api.js';
import { ELEMENTS, MESSAGES } from './utils/constants.js';

const container = document.getElementById(ELEMENTS.CONTAINER);

(async () => {

  const loader = createLoader();
  container.appendChild(loader);
  try {
    let data = [];
    data = await fetchData()
    removeLoader(container, loader);
    new TableComponent(config, data);

    if (data.length === 0) {
      showNoDataMessage(container, MESSAGES.NO_DATA);
    }
  } catch (error) {
    removeLoader(container, loader);
    showNoDataMessage(container, MESSAGES.ERROR_LOADING);
  }
})();//immediaty invoked function 

