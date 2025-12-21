// Weather Data Scraper for Extreme Weather Watch
// Fetches and parses weather data tables into JSON

import fs from 'node:fs'
import {DOMParser} from '@xmldom/xmldom'

async function fetchWeatherData() {
  const year = 2025;
  const url = 'https://www.extremeweatherwatch.com/cities/lansing/year-'+year;
  
  try {
    // Fetch the HTML page
    const response = await fetch(url, {
      headers: {
        'Cookie': 'Units=C'
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse HTML using xmldom DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all weather data tables
    let tables = doc.getElementsByClassName('daily-table');

    let weather = []

    for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
      const table = tables[tableIndex];
      const rows = table.getElementsByTagName('tr');

      // Skip if table has no rows
      if (rows.length === 0) continue;

      // Get header
      if (tableIndex === 0) {
        let headerCells = rows[0].getElementsByTagName('th');
        let header = []
        for (let i = 0; i < headerCells.length; i++) {
          header.push(headerCells[i].textContent);
        }
        weather.push(header)
      }

      for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let row = []
        for (let j = 0; j < cells.length; j++) {
          if (j > 0)
            row.push(Number(cells[j].textContent))
          else
            row.push(new Date(year+' ' + cells[j].textContent).toDateString())
        }
        weather.push(row)
      }
    }

    let weatherObj = []
    let index = []
    for (let idx = 0; idx < weather.length; idx++) {
      if (idx == 0) {
        index = weather[0]
      }
      else {
        let row = {}
        for (let i = 0; i < index.length; i++) {
          row[index[i]] = weather[idx][i]
        }
        weatherObj.push(row)
      }
    }
    
    return {obj: weatherObj, csv: weather.map(row => row.join(',')).join('\n')};
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Run the scraper
fetchWeatherData()
  .then(data => {
    console.log(`\nSuccessfully parsed ${data.obj.length} weather records`);
    fs.readFile('_data/weatherData.json', 'utf8', (err, wdata) => {
      if (err) {
        console.error(err);
        return;
      }
      
      // Add Data
      wdata = JSON.parse(wdata);
      wdata.data = data.obj;

      // Update Title
      wdata.settings.subtitle.titleText = "Lansing, MI - Weather "+data.obj[0].Day.slice(-4)

      fs.writeFile('_data/weatherData.json', JSON.stringify(wdata, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });

  })
  .catch(error => {
    console.error('Failed to fetch weather data:', error.message);
  });