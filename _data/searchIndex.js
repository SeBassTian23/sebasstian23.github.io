/**
 * Build local search index
 */

import lunr from "lunr";

export const searchindexLunr = (docs) => {

  var idx = lunr(function () {
    this.ref('url')
    this.field('title')
    this.field('excerpt')
    this.field('description')
    this.field('content')
    this.field('tags')

    docs.forEach(function (doc) {
      this.add({
        url: doc.url,
        title: doc.data.title || "",
        excerpt: doc.data.page.excerpt || "",
        description: doc.data.page.description || "",
        content: doc.templateContent || "",
        tags: doc.data.tags || ""
      })
    }, this)
  })
  return idx
}