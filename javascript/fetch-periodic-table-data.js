// Weather Data Scraper for Extreme Weather Watch
// Fetches and parses weather data tables into JSON

import fs from 'node:fs'

async function fetchPeriodicTableData() {
  const url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON?response_type=save&response_basename=PubChemElements_all';
  
  try {
    // Fetch the HTML page
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.text()
    
  } catch (error) {
    console.error('Error fetching periodic table of elements data:', error);
    throw error;
  }
}

// Download Element Information
fetchPeriodicTableData()
  .then(data => {
    fs.writeFile('_data/PubChemElements_all.json', data, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`\nSuccessfully written PubChemElements_all.json file`);
    });
  })
  .catch(error => {
    console.error('Failed to fetch periodic table of elements data:', error.message);
  });