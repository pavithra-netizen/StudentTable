import { CLASSES, ELEMENTS, EVENTS } from "../utils/constants.js";

export function renderHeader(config, table, sortState, sortAndRenderCallBack,data,filterCallback) {
    const thead = document.createElement(ELEMENTS.THEAD);
    const headerRow = document.createElement(ELEMENTS.TR);

    config.columns.forEach(element => {
        const th = document.createElement(ELEMENTS.TH);

        //filter
        const wrapper = document.createElement(ELEMENTS.DIV);
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';


        const labelSpan = document.createElement(ELEMENTS.SPAN);
        labelSpan.textContent = element.label;
        th.appendChild(labelSpan);

        if (element.sortable) {
            const iconSpan = document.createElement(ELEMENTS.SPAN);
            iconSpan.classList.add(CLASSES.SORTABLE_ICON);
            th.appendChild(iconSpan);

            sortState[element.key] = 'asc';

            th.addEventListener(EVENTS.CLICK, () => {
                const currentOrder = sortState[element.key];
                const nextOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                sortState[element.key] = nextOrder;
                th.classList.remove('asc', 'desc');
                th.classList.add(nextOrder)
                sortAndRenderCallBack(element.key, nextOrder);
            });
        }

        if(element.isFilterable){
            const uniqueValues = [...new Set(data.map(item => item[element.key]))];
                const select = document.createElement(ELEMENTS.SELECT);
                select.classList.add(CLASSES.FILTER_SELECT);
                const defaultOption = document.createElement(ELEMENTS.OPTION);
                defaultOption.value = '';
                defaultOption.textContent = 'All';
                select.appendChild(defaultOption);
    
                uniqueValues.forEach(value => {
                    const option = document.createElement(ELEMENTS.OPTION);
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });
    
                select.addEventListener(EVENTS.CHANGE, () => {
                    filterCallback(element.key, select.value);
                });
         
                wrapper.appendChild(select);
        }
        th.appendChild(wrapper);
        headerRow.appendChild(th)
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
}