// Weather Data Scraper for Extreme Weather Watch
// Fetches and parses weather data tables into JSON

async function fetchWeatherData() {
  const url = 'https://www.extremeweatherwatch.com/cities/lansing/year-2025';
  
  try {
    // Fetch the HTML page
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all weather data tables
    let tables = doc.querySelectorAll('.daily-table');

    let weather = []

    tables.forEach((table, tableIndex) => {
      const rows = table.querySelectorAll('tr');

      // Skip if table has no rows
      if (rows.length === 0) return;

      // Get header
      if( tableIndex === 0){
        let headerCells = rows[0].querySelectorAll('th');
        let header = []
        headerCells.forEach( cell => header.push(String(cell.innerText)))
        weather.push(header)
      }

      for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].querySelectorAll('td');
        let row = []
        cells.forEach( (cell, idx) => {
          if(idx > 0)
            row.push(Number(cell.innerText))
          else
            row.push(new Date('2025 ' + cell.innerText).toDateString())
        })
        weather.push(row)
      }
    });

    let weatherObj = []
    let index = []
    for(let idx in weather){
      if (idx == 0){
        index = weather[0]
      }
      else{

        let row = Object.fromEntries( index.map((k, i) => [k, weather[idx][i]]) )
        weatherObj.push(row)
      }
    }
    
    return {obj: weatherObj, csv: weather.map( row => row.join(',') ).join('\n')};
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Run the scraper
fetchWeatherData()
  .then(data => {
    console.log(`\nSuccessfully parsed ${data.obj.length} weather records`);
  })
  .catch(error => {
    console.error('Failed to fetch weather data:', error.message);
  });