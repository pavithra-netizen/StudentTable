import { ELEMENTS } from "./Table/constants.js";
import { throttle } from "../utils/helpers.js";

let ROW_HEIGHT = 48;
let throttledScrollHandlerRef; // Declare outside renderBody to maintain reference
let dataRef
const buffer = 5;

export function renderBody(data = null, config, table) {
    const container = document.getElementById(ELEMENTS.CONTAINER);
    let tbody = table.querySelector(ELEMENTS.TBODY);
    dataRef = data

    // Create tbody if it doesn't exist
    if (!tbody) {
        tbody = document.createElement(ELEMENTS.TBODY);
        table.appendChild(tbody);
    }

    const getDynamicRowHeight = (tbody) => {
        const firstRow = tbody.querySelector(ELEMENTS.TR);
        return firstRow ? firstRow.offsetHeight : 48; // fallback to 48 if no row yet
    };

    ROW_HEIGHT = getDynamicRowHeight(tbody);

    // the existing throttled function is still active and listening to scroll events.
    if (!throttledScrollHandlerRef) {
        throttledScrollHandlerRef = throttle(() => {
            const scrollTop = container.scrollTop;
            const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - buffer);
            //4418/48 = 92 -->startIndex
            const rowsCount = handleDynamicRowInsertionOrDeletion(dataRef, config, tbody); //19->TotalRowCount
            updateRows(dataRef, config, rowsCount, startIndex);
            tbody.style.transform = `translateY(${startIndex * ROW_HEIGHT}px)`; // move the <tbody> element vertically.
        }, 20);
        container.addEventListener('scroll', throttledScrollHandlerRef);
    }

    // Initial render
    const rowsCount = handleDynamicRowInsertionOrDeletion(data, config, tbody);
    updateRows(data, config, rowsCount, 0);
}

function handleDynamicRowInsertionOrDeletion(data, config, tbody) {
    const scrollTop = container.scrollTop; //0
    let startRowIndex = Math.floor(scrollTop / ROW_HEIGHT); //0/48=>0
    let endRowIndex = Math.min(data.length, Math.ceil((scrollTop + container.clientHeight) / ROW_HEIGHT));
    // 100 , (0  +  641 )  / 48 =>  13
    // Add buffer
    startRowIndex = Math.max(0, startRowIndex - buffer);
    endRowIndex = Math.min(data.length, endRowIndex + buffer);

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

        const cells = Array.from(tr.children);   //Array.from create a new array instance 

        // Create or remove TDs to match columns
        for (let j = 0; j < config.columns.length; j++) {
            if (!cells[j]) {
                const td = document.createElement(ELEMENTS.TD);
                // ✅ Set column widths only once at TD creation
                const col = config.columns[j];
                if (col.width) td.style.width = `${col.width}px`;
                if (col.minWidth) td.style.minWidth = `${col.minWidth}px`;
                if (col.maxWidth) td.style.maxWidth = `${col.maxWidth}px`;
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
