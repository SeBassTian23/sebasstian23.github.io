/**
  * Receive a formatted citation using crossref.org
  * by providing a DOI number.
  * For now the style is set to harvard 
  * The function returns a formatted string with a citation
  * for the entered DOI number. 
  * @summary Get citation from crossref.org with doi
  * @link https://crossref.org
  * @param {sting} doi Enter a DOI string.
  * @returns {Promise} Promise object is a citation string
  */
var getCitationFromDOI = async function(doi, style = "harvard1"){

  // Try to remove DOI: if user copyed it
  doi.replace( new RegExp("doi:\s{0,}","gi"),"");

  // Make sure doi is url encoded
  doi = encodeURIComponent(doi);

  // Get the post data
  var getResp = await fetch(`https://data.crossref.org/${doi}`, {
    method: "GET",
    headers: {
      "Accept": `text/bibliography; style=${style}`
    }
  });

  var response = await getResp;
  if( response.statusText == "OK")
    return response.text();
  else{
    return {msg: response.statusText };
  }
};


//  const rp = require('request-promise-native');


 // \b(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?!["&\'])\S)+)\b
 
 // /\b(10\.[0-9]{4,}(?:\.[0-9]+)*\/(?:(?![\"&\'])\S)+)\b/gim
 