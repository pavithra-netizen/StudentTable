import { DATA_TYPES } from "./constants.js";

export function simpleSort(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === DATA_TYPES.NUMBER && typeof b === DATA_TYPES.NUMBER) return a - b;
    if (typeof a === DATA_TYPES.BOOLEAN && typeof b === DATA_TYPES.BOOLEAN) return a === b ? 0 : a ? 1 : -1;
    const dateA = new Date(a), dateB = new Date(b);
    if (!isNaN(dateA) && !isNaN(dateB)) return dateA - dateB;
    return String(a).localeCompare(String(b));
  }

export function getSortedData(data,field,order){
   return [...data].sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        return order === 'asc'
          ? simpleSort(valA, valB)
          : simpleSort(valB, valA);
      });
     
}
