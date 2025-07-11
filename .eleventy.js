// Native
const fs = require("fs");
const path = require('path');

// Eleventy Plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginTOC = require('eleventy-plugin-nesting-toc');

// Own Plugin based on @jamshop/eleventy-plugin-scss
const pluginStyles = require('./_plugins/styles');

// Map Gernerating Plugin
const pluginMap = require('./_plugins/map');

// DayJS
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// Markdown
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItLinkAttr = require("markdown-it-link-attributes");

// Natural Sorting
const natsort = require("natsort").default;

// Slugify
const slugify = require("slugify");

// CSS
const purgeCssPlugin = require("eleventy-plugin-purgecss");

// Helper Functions 
const {imageHTML,imageResizedURL,imageSizes,album} = require('./_data/images');
const extractExcerpt = require('./_data/helpers').extractExcerpt;

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    templateFormats: ["md"],
    lineSeparator: "\n"
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginTOC);

  eleventyConfig.addPlugin(pluginMap);

  eleventyConfig.addPlugin(pluginStyles, {
    scss: {
      entryPoints: {
        main: "_assets/scss/main.scss"
      },
      output: "_site/css/"
    },
    minifyCss: {
      aggressiveMerging: false
    }
  });

  // Add watch targets
  eleventyConfig.addWatchTarget('./_assets/');

  // Add ignore targets
  eleventyConfig.watchIgnores.add("./_assets/images/maps");

  eleventyConfig.addPlugin(purgeCssPlugin, {
    // Optional: Specify the location of your PurgeCSS config
    config: {
      // Content files referencing CSS classes
      content: ["./_site/**/*.html", "./_site/**/*.js"],

      // CSS files to be purged in-place
      css: ["./_site/**/*.css"]
    },
    // Optional: Set quiet: true to suppress terminal output
    quiet: false,
  });

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Alias `layout: post` to `layout: layouts/post.njk`
  eleventyConfig.addLayoutAlias('default', 'layouts/default.pug');
  eleventyConfig.addLayoutAlias("post", "layouts/post.pug");
  eleventyConfig.addLayoutAlias("minimal", "layouts/minimal.pug");
  eleventyConfig.addLayoutAlias("home", "layouts/home.pug");
  eleventyConfig.addLayoutAlias("project", "layouts/project.pug");

  // Add RSS related Filters for Pug
  eleventyConfig.addFilter("getNewestCollectionItemDate", pluginRss.getNewestCollectionItemDate);
  eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addFilter("absoluteUrl", pluginRss.absoluteUrl);
  eleventyConfig.addFilter("htmlToAbsoluteUrls", pluginRss.convertHtmlToAbsoluteUrls);

  // Format dates
  eleventyConfig.addFilter("formatedDate", dateObj => {
    // return dayjs.utc(dateObj).format("DD MMM YYYY");
    return dayjs.utc(dateObj).format("MM/DD/YYYY");
  });
  eleventyConfig.addFilter('htmlDatetimeString', (dateObj) => {
    return dayjs.utc(dateObj).format("YYYY-MM-DD");
  });

  // Add slugify support
  eleventyConfig.addFilter("slugify", (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true
    };
    return slugify(input, options);
  });


  eleventyConfig.addFilter("natsort", (list) => { return list.sort(natsort({ insensitive: true })); });

  eleventyConfig.addFilter("getSingleCategory", (collection, str) => {
    return collection.filter((x) => {
      return x.data.categories.indexOf(str) > -1;
    });
  });

  eleventyConfig.addFilter('markdown', (text) => {
    if (fs.existsSync(path.join(process.cwd(), "src", text)))
      text = fs.readFileSync(path.join(process.cwd(), "src", text), { encoding: 'utf8', flag: 'r' });
    return markdownLibrary.render(text);
  });

  /**
   * Add collections
   */

  eleventyConfig.addCollection('posts', collection => {
    return collection.getFilteredByGlob('./src/posts/**/*.md');
  });

  eleventyConfig.addCollection('categories', collection => {
    let categories = [];
    collection.getFilteredByGlob('./src/posts/**/*.md')
      .forEach(item => {
        if (item.data.categories)
          categories.push(item);
      });
    return categories;
  });

  eleventyConfig.addCollection('categoryList', collection => {
    let categories = [];
    collection.getFilteredByGlob('./src/posts/**/*.md')
      .forEach(item => {
        if (item.data.categories)
          categories = [...item.data.categories, ...categories]
      });
    return [...new Set(categories)].sort(natsort({ insensitive: true }));
  });

  eleventyConfig.addCollection('tagList', collection => {
    let tags = [];
    collection.getFilteredByGlob('./src/posts/**/*.md')
      .forEach(item => {
        if (item.data.tags)
          tags = [...item.data.tags, ...tags]
      });
    return [...new Set(tags)].sort(natsort({ insensitive: true }));
  });

  eleventyConfig.addCollection('featured', collection => {
    return collection.getFilteredByGlob('./src/posts/**/*.md')
      .filter(x => x.data.featured);
  });


  /**
   * Add shortcodes
   */

  eleventyConfig.addNunjucksShortcode("image", imageHTML);
  eleventyConfig.addLiquidShortcode("image", imageHTML);
  // === Liquid needed if `markdownTemplateEngine` **isn't** changed from Eleventy default
  eleventyConfig.addJavaScriptFunction("image", imageHTML);

  eleventyConfig.addNunjucksShortcode("imageResizedURL", imageResizedURL);
  eleventyConfig.addLiquidShortcode("imageResizedURL", imageResizedURL);
  // === Liquid needed if `markdownTemplateEngine` **isn't** changed from Eleventy default
  eleventyConfig.addJavaScriptFunction("imageResizedURL", imageResizedURL);

  eleventyConfig.addNunjucksShortcode("album", album);
  eleventyConfig.addLiquidShortcode("album", album);
  // === Liquid needed if `markdownTemplateEngine` **isn't** changed from Eleventy default
  eleventyConfig.addJavaScriptFunction("album", album);

  eleventyConfig.addShortcode("fileTime", function(filepath, dateformat='YYYY-MM-DD') {
    if ( fs.existsSync( path.join(process.cwd(), filepath) ) ){
      let stats = fs.statSync( path.join(process.cwd(), filepath) )
      return dayjs.utc(stats.mtime).format(dateformat);
    }
    return "Unknown date"
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!-- excerpt -->"
  });
  eleventyConfig.addShortcode("excerpt", extractExcerpt);

  /**
   * Passthrough Settings
   */

  // Copy css dependencies
  // eleventyConfig.addPassthroughCopy({ "./node_modules/prismjs/themes/": "/css/prism" });
  // eleventyConfig.addPassthroughCopy({ "_assets/scss/base/prism-theme.css": "/css/prism.css" });

  // Copy javascript dependencies
  eleventyConfig.addPassthroughCopy({ "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "./javascript/bootstrap.bundle.min.js" });
  eleventyConfig.addPassthroughCopy({ "_assets/javascript/*.js": "./javascript/" });

  // Photosynthesis Scheme
  eleventyConfig.addPassthroughCopy({ "./node_modules/photosynthesis-scheme/dist/photosynthesis.min.js": "./javascript/photosynthesis.min.js" });

  // Calendar Heatmap
  eleventyConfig.addPassthroughCopy({ "./node_modules/calendar-heatmap/dist/calendarheatmap.min.js": "./javascript/calendarheatmap.min.js" });

  // Copy font files
  eleventyConfig.addPassthroughCopy({ "./node_modules/bootstrap-icons/font/fonts": "/css/fonts" });

  // Copy favicon files and manifest file
  eleventyConfig.addPassthroughCopy({ "_assets/icons": "/" });
  eleventyConfig.addPassthroughCopy({ "_assets/*.webmanifest": "/" });
  eleventyConfig.addPassthroughCopy({ "_assets/videos": "/videos" });

  // Copy asset images to img
  // eleventyConfig.addPassthroughCopy( {"_assets/images/**/*.svg": "/images"});
  eleventyConfig.addPassthroughCopy({ "_assets/public": "/public" });

  // Copy CNAME
  eleventyConfig.addPassthroughCopy({ "_assets/CNAME": "CNAME" });

  /**
   * Markdown Setup
   */

  // Customize Markdown library and settings:
  // Fix: https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/15
  const { pairedShortcode } = require("@11ty/eleventy-plugin-syntaxhighlight");
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    highlight: function(content, language){
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
  .use(require('markdown-it-container'), 'post', {

    validate: function(params) {
      return params.trim().match(/^map|album\s{0,}(.*)$/);
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^(map|album)\s{0,}(.*)$/);
      
      if (tokens[idx].nesting === 1) {
        // if content is an album
        if(m[0] === 'album')
          return '<section class="post-album post-album-inline py-3">\n<div class="row row-cols-sm-2 row-cols-lg-3 row-cols-xl-4" data-masonry="{"percentPosition": true}">\n';

        // if content is a map
        if(m[1] === 'map'){
          let container = ''
          let content = []
          let options = {}
          let width = 600;
          let i = 1;
          while( tokens[idx+i].type !== 'container_post_close' ){
            if(tokens[idx+i].content !== ''){
              container += tokens[idx+i].content;
            }
            i++;
          }
          try{
            parsedContent = JSON.parse(container) || []
            content = parsedContent;
            if(!Array.isArray(parsedContent)){
              content = parsedContent.data || []
              options = parsedContent.options || {}
            }
          }
          catch(e){
            console.log('Issue:\n' + container);
            console.log(e)
          }

          return '<section>\n<div class="post-map text-center">\n' + filters.image( filters.url( filters.map(content, options, filters.slugify(m[2]) || 'post-map' ) ), "Map with Location Marker", (options.containerWidth || width) ) + '\n';
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

    return imageHTML(imgSrc, imgAlt, sizes = "100vw");
  }

  markdownLibrary.renderer.rules.table_open = function(tokens, idx) {
    return '<div class="table-responsive"><table class="table">';
  };

  markdownLibrary.renderer.rules.table_close = function(tokens, idx) {
    return '</table></div>';
  };

  markdownLibrary.renderer.rules.blockquote_open = function(tokens, idx) {
    return '<blockquote class="blockquote">';
  };

  eleventyConfig.setLibrary("md", markdownLibrary);

  /**
   * Pug Setup
   */

  // Set options for Pug
  global.filters = eleventyConfig.javascriptFunctions;
  eleventyConfig.setPugOptions({
    globals: ['filters'],
    filters: {
      'markdown-it': function (text, options) {
        return markdownLibrary.render(text, options);
      }
    },
    debug: false
  });

  /**
   * Browser Config
   */

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
      "pug"
    ],

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "liquid",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "pug",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: "src",
      includes: "../_includes",
      data: "../_data",
      assets: "../_assets",
      output: "_site"
    }
  };
};
