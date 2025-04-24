export async function fetchData(url = 'data.json') {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Data from JSON file:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
