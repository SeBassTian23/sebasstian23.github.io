(function (window, document) {
  "use strict";

  if(!navigator.share)
    document.querySelectorAll(".share-menu-url").forEach( e => e.parentElement.remove() );

  document.querySelectorAll(".share-menu-url").forEach( e => e.addEventListener("click", async (e) => {
      e.preventDefault();
      let data = {
        title: e.currentTarget?.title.replace('Share: ', '') || "Share",
        text: document.querySelector('meta[name="description"]').content || e.currentTarget?.title,
        url: e.currentTarget?.href
      };
      if( navigator.canShare(data) )
        try {
          await navigator.share(data);
        } catch (err) {
          console.log(err)
        }
      else {
        alert("Sharing currently not available.");
      }
    })
  )

})(window, document);
