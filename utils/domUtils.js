import { fetchData } from "../api.js";
import { APP_URL, ELEMENTS } from "../utils/constants.js";

const ROW_HEIGHT = 48;

export function renderRows(data = null, config, table, page = 0) {
    const container = document.getElementById("container");
    let tbody = table.querySelector(ELEMENTS.TBODY);

    // Create tbody if it doesn't exist
    if (!tbody) {
        tbody = document.createElement(ELEMENTS.TBODY);
        table.appendChild(tbody);
    }

    // Scroll event
    container.addEventListener('scroll', (event) => {
        const scrollTop = container.scrollTop;  //4418 scrollTop 
        const startIndex = Math.floor(scrollTop / ROW_HEIGHT); // 4418/48 = 92 -->startIndex

        const rows = handleDynamicRowInsertionOrDeletion(data, config, tbody, table)
        updateRows(data, config, rows, startIndex);
        tbody.style.transform = `translateY(${startIndex * ROW_HEIGHT}px)`;
        console.log("====", data)

        // 👇 Infinite scroll trigger
        // const target = event?.target;
        // if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
        //     handleInfiniteScroll(page, data, config, table)
        // }
    });

    // Initial render
    const rows = handleDynamicRowInsertionOrDeletion(data, config, tbody, table)
    updateRows(data, config, rows, 0);
}

function handleDynamicRowInsertionOrDeletion(data, config, tbody, table) {
    const scrollTop = container.scrollTop; //0
    const startRowIndex = Math.floor(scrollTop / ROW_HEIGHT); //0/48 =>0
    const endRowIndex = Math.min(data.length, Math.ceil((scrollTop + container.clientHeight) / ROW_HEIGHT));
    // (100,(0+374)/48)=>374/48=>7 ==> so 7
    // startRoeIndex= 0 ,endRowIndex=7 
    const visibleRowCount = endRowIndex - startRowIndex;//7-0 = 7
   
    const existingRows = Array.from(tbody.querySelectorAll(ELEMENTS.TR));
    const rows = [];

    // Reuse or create required number of TRs
    for (let i = 0; i < visibleRowCount; i++) { //7round
        let tr = existingRows[i];

        if (!tr) {
            tr = document.createElement(ELEMENTS.TR);
            tbody.appendChild(tr);
        }

        const cells = Array.from(tr.children);

        // Create or remove TDs to match columns
        for (let j = 0; j < config.columns.length; j++) { //4 round 
            if (!cells[j]) {
                const td = document.createElement(ELEMENTS.TD);
                tr.appendChild(td);
            }
        }
        while (tr.children.length > config.columns.length) { //7>4
            tr.removeChild(tr.lastChild);
        }
        rows.push(tr);
    }

    // Remove extra rows if any
    while (tbody.children.length > visibleRowCount) { //4>7
        tbody.removeChild(tbody.lastChild);
    }
    
    // Spacer div for scroll illusion (Fake scroller)
    let spacer = container.querySelector(".virtual-scroll-spacer");
    if (!spacer) {
        spacer = document.createElement("div");
        spacer.className = "virtual-scroll-spacer";
        container.appendChild(spacer);
    }
    const header = table.querySelector("thead");
    const headerHeight = header?.offsetHeight || 0;
    const visibleRowsHeight = container.clientHeight;
    const scrollableHeight = Math.max(0, data.length * ROW_HEIGHT - visibleRowsHeight + headerHeight);
    //0,100*48-374+
    spacer.style.height = `${scrollableHeight}px`;
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
                const renderFn = config.customRender[col.key];

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