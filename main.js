import { TableComponent } from './components/TableComponent.js';
import { showNoDataMessage } from './utils/helpers.js';
import { config } from './config.js';
import { fetchData } from './api.js';
import { ELEMENTS } from './utils/constants.js';

const container = document.createElement(ELEMENTS.CONTAINER);

(async () => {
  try {
    const data = await fetchData();
    new TableComponent(config, data);

    if (data.length === 0) {
      showNoDataMessage.noData(container);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showNoDataMessage.error(container);
  }
})();//immediaty invoked function 

