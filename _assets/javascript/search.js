(function (window, document) {
  "use strict";

  const search = function(e){

    var query = e.target.value;
    if(query.length > 2){
      query += "~1";
      const results = window.searchIndex.search(query, {
        bool: "OR",
        expand: true,
      });

      const resEl = document.getElementById("searchResults");
      resEl.style.display = "none";

      resEl.innerHTML = "";
      if (results && e.target.value != "" && results.length > 0 ) {

        const el = document.createElement("li");
        resEl.appendChild(el);
        el.innerHTML += `<h6 class="dropdown-header">Posts</h6>`;

        results.map((r) => {
        
          const el = document.createElement("li");
          resEl.appendChild(el);

          let title = window.metaIndex[r.ref].title || r.ref;
          let excerpt = (window.metaIndex[r.ref].description != undefined)? window.metaIndex[r.ref].description : window.metaIndex[r.ref].excerpt;

          el.innerHTML += `<a class="dropdown-item" href="${r.ref}">${title}<div class="text-muted" style="font-size:smaller">${excerpt}</div></a>`;
        });
        resEl.style.display = "block";
      }
      else if(results && e.target.value != "" && results.length == 0){
        const el = document.createElement("li");
        resEl.appendChild(el);
        el.innerHTML += `<h6 class="dropdown-header">No results found for "<strong>${e.target.value}</strong>"</h6>`;
        resEl.style.display = "block";
      }
      else if(results && e.target.value == ""){
        resEl.style.display = "none";
      }
    }else{
      const resEl = document.getElementById("searchResults");
      resEl.style.display = "none";
    }
  };

  fetch("/search-index.json").then((response) =>
    response.json().then((rawIndex) => {
      window.searchIndex = lunr.Index.load(rawIndex);
      window.metaIndex = rawIndex.meta;
    }).finally(()=>{
      // Attach Search
      document.getElementById("searchField").addEventListener("input", search);
      // Keyboard shortcut for search
      document.querySelector('body').addEventListener( 'keydown', function ( event ) {
        if ( event.key === "/" && document.activeElement !== document.querySelector("#searchField")) {
          event.preventDefault()
          document.querySelector("#searchField").focus();
        }
      });
    })
  );
})(window, document);