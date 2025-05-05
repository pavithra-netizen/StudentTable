import { TableComponent } from './components/Table/TableComponent.js';
import { config } from './config.js';
import { fetchData } from './api.js';

new TableComponent(config, fetchData);


