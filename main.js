import { TableComponent } from './components/TableComponent.js';
import { showNoDataMessage } from './utils/helpers.js';
import { config } from './config.js';
import { fetchData } from './api.js';

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

