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

          // let match = Object.keys(r.matchData.metadata);
          console.log(window.metaIndex[r.ref])
          let title = window.metaIndex[r.ref].title;
          let excerpt = window.metaIndex[r.ref].excerpt;

          // for(let m in match){
          //   if(r.matchData.metadata[match[m]].title !== undefined){
          //     console.log(r.matchData.metadata[match[m]])
          //     let positions = r.matchData.metadata[match[m]].title.position;

          //     // title = title.replace( new RegExp( `(${match[m]})`,"i"), "<strong>$1</strong>");

          //     for(let p in positions){
          //       console.log( title, title.slice(positions[p][0],positions[p][1]) )
          //     }
          //   }
          // }

          // Object.keys(r.matchData.metadata).forEach(function (term) {
          //   Object.keys(r.matchData.metadata[term]).forEach(function (fieldName) {
          //     // var field = li.querySelector('[data-field=' + fieldName + ']'),
          //     var positions = r.matchData.metadata[term][fieldName].position;
          //     for(let p in positions){

          //     }
          //   });
          // });


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
      // window.searchIndex = elasticlunr.Index.load(rawIndex);
      document.getElementById("searchField").addEventListener("input", search);
    })
  );
})(window, document);