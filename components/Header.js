import { renderSearchBar } from "../utils/search.js";
import { CLASSES, ELEMENTS, TEXT } from "./Table/constants.js";

export function renderHeader(config, table, sortState, handleTableSort, data, handleTableFilter, handleTableSearch) {
    const thead = document.createElement(ELEMENTS.THEAD);
    const headerRow = document.createElement(ELEMENTS.TR);

    config.columns.forEach(element => {
        const th = document.createElement(ELEMENTS.TH);
        // Apply width settings
        if (element.width) th.style.width = `${element.width}px`;
        if (element.minWidth) th.style.minWidth = `${element.minWidth}px`;
        if (element.maxWidth) th.style.maxWidth = `${element.maxWidth}px`;
        //filter
        const wrapper = document.createElement(ELEMENTS.DIV);

        const labelSpan = document.createElement(ELEMENTS.SPAN);
        labelSpan.textContent = element.label;
        th.appendChild(labelSpan);

        if (element.isSortable) {
            const iconSpan = document.createElement(ELEMENTS.SPAN);
            iconSpan.classList.add(CLASSES.SORTABLE_ICON, CLASSES.NEUTRAL);
            sortState[element.key] = TEXT.SORT_STATES.NEUTRAL;

            iconSpan.addEventListener('click', () => {
                const currentOrder = sortState[element.key];
                const nextOrder = currentOrder === TEXT.SORT_STATES.NEUTRAL ? TEXT.SORT_STATES.ASC :
                    (currentOrder === TEXT.SORT_STATES.ASC ? TEXT.SORT_STATES.DESC : TEXT.SORT_STATES.NEUTRAL);
                sortState[element.key] = nextOrder;
                iconSpan.classList.remove(CLASSES.ASC, CLASSES.DESC, CLASSES.NEUTRAL);
                iconSpan.classList.add(CLASSES.SORTABLE_ICON, CLASSES[nextOrder.toUpperCase()]);
                handleTableSort(element.key, nextOrder);
            });
            th.appendChild(iconSpan);
        }

        // Search Logic
        if (element.isSearchable) {
            const searchIcon = document.createElement(ELEMENTS.SPAN);
            searchIcon.classList.add(CLASSES.SEARCH);
            searchIcon.textContent = "🔍";

            searchIcon.addEventListener('click', () => {
                const searchWrapper = renderSearchBar(handleTableSearch);
                th.appendChild(searchWrapper);
                searchIcon.style.display = 'none'; // Hide the search icon after click
            });

            th.appendChild(searchIcon);
        }

        if (element.isFilterable) {
            const uniqueValues = [...new Set(data.map(item => item[element.key]))];
            const select = document.createElement(ELEMENTS.SELECT);
            select.classList.add(CLASSES.FILTER_SELECT);
            const defaultOption = document.createElement(ELEMENTS.OPTION);
            defaultOption.value = '';
            defaultOption.textContent = TEXT.ALL_OPTION;
            select.appendChild(defaultOption);

            uniqueValues.forEach(value => {
                const option = document.createElement(ELEMENTS.OPTION);
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                handleTableFilter(element.key, select.value);
            });

            wrapper.appendChild(select);
        }

        th.appendChild(wrapper);
        headerRow.appendChild(th)
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
}