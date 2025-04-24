import { ELEMENTS } from "../utils/constants.js";

export function renderRows(data = null, config, table) {
    const existingTbody = table.querySelector(ELEMENTS.TBODY);
    if (existingTbody) table.removeChild(existingTbody) // clear the existing body

    const tbody = document.createElement(ELEMENTS.TBODY);
    data.forEach(element => {
        const contentRow = document.createElement(ELEMENTS.TR);
        config.columns.forEach(col => {
            const td = document.createElement(ELEMENTS.TD);
            const customRenderFn = config.customRender[col.key]
            if (customRenderFn) {
               td.appendChild(customRenderFn(element[col.key]))
            }
            else {
                td.textContent = element[col.key]
            }

            contentRow.appendChild(td)
        })
        tbody.appendChild(contentRow)
    })

    table.appendChild(tbody);
}
