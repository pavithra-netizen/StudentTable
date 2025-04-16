
export function fetchStudentData(url) {
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data.json');
        return res.json();
      });
  }