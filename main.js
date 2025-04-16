import { TableComponent } from './components/TableComponent.js';
import { fetchStudentData } from './api.js';
import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('table-container');
  new TableComponent(config, () => fetchStudentData(config.apiUrl), container);
});
