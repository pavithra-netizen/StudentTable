import { ELEMENTS, EVENTS } from "../utils/constants.js";
import {  throttle } from "../utils/helpers.js"

const ROW_HEIGHT = 48;

let throttledScrollHandlerRef; // Declare outside renderBody to maintain reference
let dataRef

export function renderBody(data = null, config, table, page = 0) {
    const container = document.getElementById(ELEMENTS.CONTAINER);
    let tbody = table.querySelector(ELEMENTS.TBODY);
    dataRef = data

    // Create tbody if it doesn't exist
    if (!tbody) {
        tbody = document.createElement(ELEMENTS.TBODY);
        table.appendChild(tbody);
    }

    if (!throttledScrollHandlerRef) {
        throttledScrollHandlerRef = throttle(() => {
            const scrollTop = container.scrollTop;
            const startIndex = Math.floor(scrollTop / ROW_HEIGHT); //4418/48 = 92 -->startIndex
            const rows = handleDynamicRowInsertionOrDeletion(dataRef, config, tbody);
            updateRows(dataRef, config, rows, startIndex);
            tbody.style.transform = `translateY(${startIndex * ROW_HEIGHT}px)`;
        }, 20);
        container.addEventListener(EVENTS.SCROLL, throttledScrollHandlerRef);
    }

    // Initial render
    const rows = handleDynamicRowInsertionOrDeletion(data, config, tbody)
    updateRows(data, config, rows, 0);
}

function handleDynamicRowInsertionOrDeletion(data, config, tbody) {
    const scrollTop = container.scrollTop; //0
    const startRowIndex = Math.floor(scrollTop / ROW_HEIGHT); //0/48=>0
    const endRowIndex = Math.min(data.length, Math.ceil((scrollTop + container.clientHeight) / ROW_HEIGHT));
                                  // 100 , (0  +  641 )  / 48 =>  13
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
