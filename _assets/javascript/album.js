document.addEventListener('DOMContentLoaded', function () {
  // Get the p element as a node
  const inlineAlbums = document.querySelectorAll(".post-album-inline p").forEach(parent => {
    // Save a reference to the parent's children
    const children = parent.childNodes;
    // Create a DocumentFragment to hold the children
    const docFrag = document.createDocumentFragment();
    // Append all children to the DocumentFragment
    while (children.length > 0) {
      docFrag.appendChild(children[0]);
    }
    // Replace the parent with the DocumentFragment
    parent.replaceWith(docFrag);
  });

  document.querySelectorAll(".post-album div > *").forEach(child => {
    if (child.nodeName == 'BR')
      child.remove()
    else if (child.nodeName == 'DIV')
      child;
    else
      child.setAttribute('class', 'col mb-2 px-1');
  })

  let background = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
  const zoom = mediumZoom('.post-album picture img', { background, container: null });

  //- col mb-2 px-1
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-bs-theme") {
        let background = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
        zoom.update({ background });
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(document.querySelector('html'), {
    attributes: true,
    childList: false,
    subtree: false
  });

  //- zoom.on('open', event => {
  //-   let background = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
  //-   zoom.update({background});
  //- });

  document.querySelectorAll('.post-map p').forEach(e => e.remove())

});