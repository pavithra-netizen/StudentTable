import { TableComponent } from './components/TableComponent.js';
import { showNoDataMessage } from './utils/helpers.js';
import { config } from './config.js';
import { fetchData } from './api.js';
import { ELEMENTS, MESSAGES } from './utils/constants.js';

const container = document.getElementById(ELEMENTS.CONTAINER);

(async () => {
  try {
    let data = [];
    data =  await fetchData()
    new TableComponent(config, data);

    if (data.length === 0) {
      showNoDataMessage(container,MESSAGES.NO_DATA);
    }
  } catch (error) {
    showNoDataMessage(container,MESSAGES.ERROR_LOADING);
  }
})();//immediaty invoked function 

