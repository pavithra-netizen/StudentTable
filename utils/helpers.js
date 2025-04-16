export function sortByKey(data, key, direction = 'asc') {
    const dir = direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir * (valA - valB);
      }
      return dir * String(valA).localeCompare(String(valB));
    });
  }
  
  export function filterByKey(data, key, value) {
    if (!key || value === 'All') return data;
    return data.filter(item => item[key] === value);
  }
  
  export function uniqueValues(data, key) {
    return [...new Set(data.map(item => item[key]))];
  }
  