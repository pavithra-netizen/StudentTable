import { ELEMENTS } from "../utils/constants.js";
import { throttle } from "../utils/helpers.js"

const ROW_HEIGHT = 48;

let throttledScrollHandlerRef; // Declare outside renderBody to maintain reference
let dataRef
let tbodyRef

export function renderBody(data = null, config, table, page = 0) {
    const container = document.getElementById(ELEMENTS.CONTAINER);
    let tbody = table.querySelector(ELEMENTS.TBODY);
    tbodyRef = tbody
    dataRef = data

    // Create tbody if it doesn't exist
    if (!tbody) {
        tbody = document.createElement(ELEMENTS.TBODY);
        table.appendChild(tbody);
    }

    if (!throttledScrollHandlerRef) {
        throttledScrollHandlerRef = throttle(() => {
            const scrollTop = container.scrollTop;
            const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
            const rows = handleDynamicRowInsertionOrDeletion(dataRef, config, tbody, table);
            updateRows(dataRef, config, rows, startIndex);
            tbody.style.transform = `translateY(${startIndex * ROW_HEIGHT}px)`;
            //  Infinite scroll trigger
            // const target = event?.target;
            // if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
            //     // handleInfiniteScroll(page, data, config, table)
            // }
        }, 20);
        container.addEventListener('scroll', throttledScrollHandlerRef);
    }

    // Initial render
    const rows = handleDynamicRowInsertionOrDeletion(data, config, tbody, table)
    updateRows(data, config, rows, 0);
}

function handleDynamicRowInsertionOrDeletion(data, config, tbody, table) {
    const scrollTop = container.scrollTop;
    const startRowIndex = Math.floor(scrollTop / ROW_HEIGHT);
    const endRowIndex = Math.min(data.length, Math.ceil((scrollTop + container.clientHeight) / ROW_HEIGHT));
    const visibleRowCount = endRowIndex - startRowIndex;

    const existingRows = Array.from(tbody.querySelectorAll(ELEMENTS.TR));
    const rows = [];

    // Reuse or create required number of TRs
    for (let i = 0; i < visibleRowCount; i++) {
        let tr = existingRows[i];

        if (!tr) {
            tr = document.createElement(ELEMENTS.TR);
            tbody.appendChild(tr);
        }

        const cells = Array.from(tr.children);

        // Create or remove TDs to match columns
        for (let j = 0; j < config.columns.length; j++) {
            if (!cells[j]) {
                const td = document.createElement(ELEMENTS.TD);
                td.offsetHeight;
                tr.appendChild(td);
            }
        }
        while (tr.children.length > config.columns.length) {
            tr.removeChild(tr.lastChild);
        }
        rows.push(tr);
    }

    // Remove extra rows if any
    while (tbody.children.length > visibleRowCount) {
        tbody.removeChild(tbody.lastChild);
    }

    // Spacer div for scroll illusion (Fake scroller)
    // let spacer = container.querySelector(".virtual-scroll-spacer");
    // if (!spacer) {
    //     spacer = document.createElement("div");
    //     spacer.className = "virtual-scroll-spacer";
    //     container.appendChild(spacer);
    // }
    // const header = table.querySelector("thead");
    // const headerHeight = header?.offsetHeight || 0;
    // const visibleRowsHeight = container.clientHeight;
    // const scrollableHeight = Math.max(0, data.length * ROW_HEIGHT - visibleRowsHeight + headerHeight);
    // //0,100*48-374+
    // spacer.style.height = `${scrollableHeight}px`;
    return rows
}

function updateRows(data, config, rows, startIndex) {
    rows.forEach((row, i) => {
        const rowData = data[startIndex + i];
        const cells = Array.from(row.children);

        config.columns.forEach((col, j) => {
            const cell = cells[j];

            // Clear previous content
            while (cell.firstChild) cell.removeChild(cell.firstChild);

            if (rowData) {
                const value = rowData[col.key];
                const renderFn = config.tableDataCustomRenderer[col.key];

                if (renderFn) {
                    const node = renderFn(value);
                    if (node) cell.appendChild(node);
                } else {
                    cell.textContent = value;
                }
            } else {
                cell.textContent = '';
            }
        });
    });
}

// async function handleInfiniteScroll(currentPageNumber, currentData, config, table) {
//     const page = currentPageNumber + 1
//     const url = APP_URL.GET_USERS_LIST.replace('{{PAGE}}', page).replace('{{LIMIT}}', 20)
//     const data = await fetchData(url);
//     renderRows([...currentData, ...data], config, table, page);
// }