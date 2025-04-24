import { TableComponent } from './components/TableComponent.js';
import { showNoDataMessage } from './utils/helpers.js';
import { config } from './config.js';
import { fetchData } from './api.js';

const container = document.getElementById('table-container');

(async () => {
  try {
    const data = await fetchData();
    new TableComponent(config, container, data);

    if (data.length === 0) {
      showNoDataMessage.noData(container);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showNoDataMessage.error(container);
  }
})();
