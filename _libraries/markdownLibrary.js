// Markdown
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItContainer from "markdown-it-container";
import markdownItLinkAttr from "markdown-it-link-attributes";

import { imageHTML, imageSizes } from "../_data/images.js";
import { pairedShortcode } from "@11ty/eleventy-plugin-syntaxhighlight";

// Customize Markdown library and settings:
// Fix: https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/15
let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    highlight: function (content, language) {
      return pairedShortcode(content, language);
    }
  })
  .use(markdownItAnchor, {
    level: 1,
    // slugify: string => string,
    permalink: false,
    // renderPermalink: (slug, opts, state, permalink) => {},
    permalinkClass: 'header-anchor',
    permalinkSymbol: '¶',
    permalinkBefore: false
  })
  .use(markdownItLinkAttr, {
    pattern: /^https?:\/\//,
    attrs: {
      target: '_blank',
      rel: 'noreferrer'
    }
  })
  .use(markdownItContainer, 'post', {

    validate: function (params) {
      return params.trim().match(/^map|album\s{0,}(.*)$/);
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^(map|album)\s{0,}(.*)$/);

      if (tokens[idx].nesting === 1) {
        // if content is an album
        if (m[0] === 'album')
          return '<section class="post-album post-album-inline py-3">\n<div class="row row-cols-sm-2 row-cols-lg-3 row-cols-xl-4" data-masonry="{"percentPosition": true}">\n';

        // if content is a map
        if (m[1] === 'map') {
          let container = ''
          let content = []
          let options = {}
          let width = 600;
          let i = 1;
          while (tokens[idx + i].type !== 'container_post_close') {
            if (tokens[idx + i].content !== '') {
              container += tokens[idx + i].content;
            }
            i++;
          }
          try {
            parsedContent = JSON.parse(container) || []
            content = parsedContent;
            if (!Array.isArray(parsedContent)) {
              content = parsedContent.data || []
              options = parsedContent.options || {}
            }
          }
          catch (e) {
            console.log('Issue:\n' + container);
            console.log(e)
          }

          return '<section>\n<div class="post-map text-center">\n' + filters.image(filters.url(filters.map(content, options, filters.slugify(m[2]) || 'post-map')), "Map with Location Marker", (options.containerWidth || width)) + '\n';
        }
      }
      else {
        // closing tag
        return '</div>\n</section>\n';
      }
    }
  })

markdownLibrary.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  let imgSrc = token.attrGet('src')
  const imgAlt = token.content

  // you can modify the default sizes, or omit
  const imgSize = token.attrGet('title') || imageSizes;

  return imageHTML(imgSrc, imgAlt, imgSize);
}

markdownLibrary.renderer.rules.table_open = function (tokens, idx) {
  return '<div class="table-responsive"><table class="table">';
};

markdownLibrary.renderer.rules.table_close = function (tokens, idx) {
  return '</table></div>';
};

markdownLibrary.renderer.rules.blockquote_open = function (tokens, idx) {
  return '<blockquote class="blockquote">';
};

export default markdownLibrary;