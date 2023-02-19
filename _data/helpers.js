const striptags = require("striptags");

module.exports = {
  /**
   * Returns back some attributes based on whether the
   * link is active or a parent of an active item
   *
   * @param {String} itemUrl The link in question
   * @param {String} pageUrl The page context
   * @returns {String} The attributes or empty
   */
  getLinkActiveState(itemUrl, pageUrl) {
    let response = {};

    if (itemUrl === pageUrl) {
      response["aria-current"] = "page";
      response["class"] = "active";
    }

    if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
      response["aria-current"] = "page";
      response["data-state"] = "active";
    }

    return response;
  },
  /**
   * Filters out the passed item from the passed collection
   * and randomises and limits them based on flags
   *
   * @param {Array} collection The 11ty collection we want to take from
   * @param {Object} item The item we want to exclude (often current page)
   * @param {Number} limit=3 How many items we want back
   * @param {Boolean} random=true Wether or not this should be randomised
   * @returns {Array} The resulting collection
   */
 getSiblingContent(collection, item, limit = 3, random = true) {
  let filteredItems = collection.filter(x => x.url !== item.url);

  if (random) {
    let counter = filteredItems.length;

    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      counter--;

      let temp = filteredItems[counter];

      // Swap the last element with the random one
      filteredItems[counter] = filteredItems[index];
      filteredItems[index] = temp;
    }
  }

  // Lastly, trim to length
  if (limit > 0) {
    filteredItems = filteredItems.slice(0, limit);
  }
  
    return filteredItems;
  },

  extractExcerpt(article, experptLength = 500) {

    let content = "";
    let excerpt = null;
  
    if (!article.hasOwnProperty("data"))
      content = article
    else
      content = article.data.page.excerpt;
  
    excerpt = striptags(content)
      .substring(0, experptLength) // Cap at 200 characters
      .replace(/^\s+|\s+$|\s+(?=\s)/g, "")
      .trim();
    return (excerpt && excerpt.length == experptLength)? `${excerpt}…` : excerpt || "" ;
  }

};
  