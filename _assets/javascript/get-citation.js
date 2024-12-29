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
const getCitationFromDOI = async function(doi, style = "harvard1"){

  // Try to remove DOI: if user copyed it
  doi.replace( new RegExp("doi:\s{0,}","gi"),"");

  // Make sure doi is url encoded
  doi = encodeURIComponent(doi);

  // Get the post data
  var getResp = await fetch(`https://doi.org/${doi}`, {
    method: "GET",
    headers: {
      "Accept": `text/bibliography; style=${style}`
    }
  });

  var response = await getResp;
  if( response.ok)
    return response.text();

  return {msg: response.statusText };
};

/**
  * Validate a given DOI number
  * @summary Validate DOI number
  * @link https://www.crossref.org/blog/dois-and-matching-regular-expressions/
  * @param {sting} doi Enter a DOI string.
  * @returns {Boolean} True if the DOI is valid, otherwise false
  */
const checkDOI = (doi) => {
  if(doi.match( /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i ) )
    return true

  return false
}
 