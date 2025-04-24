import { ELEMENTS } from "../utils/constants.js";

export function renderBody(data = null, config, table) {
    const existingTbody = table.querySelector(ELEMENTS.TBODY);
    if (existingTbody) table.removeChild(existingTbody) // clear the existing body

    const tbody = document.createElement(ELEMENTS.TBODY);
    data.forEach(element => {
        const contentRow = document.createElement(ELEMENTS.TR);
        config.columns.forEach(col => {
            const td = document.createElement(ELEMENTS.TD);
            const tableDataCustomRenderer = config.tableDataCustomRenderer[col.key]
            !!tableDataCustomRenderer ?
                td.appendChild(tableDataCustomRenderer(element[col.key])) :
                td.textContent = element[col.key]
            contentRow.appendChild(td)
        })
        tbody.appendChild(contentRow)
    })

    table.appendChild(tbody);
}
