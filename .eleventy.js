// Native
const fs = require("fs");
const path = require('path');

// Eleventy Plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSCSS = require("@jamshop/eleventy-plugin-scss");
const pluginTOC = require('eleventy-plugin-nesting-toc');

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
const {imageHTML,imageResizedURL,imageSizes} = require('./_data/images');
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
  eleventyConfig.addPlugin(pluginSCSS, {
    entryPoints: {
      main: "_assets/scss/main.scss"
    },
    output: "_site/css/"
  });

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

  // Copy font files
  eleventyConfig.addPassthroughCopy({ "./node_modules/bootstrap-icons/font/fonts": "/css/fonts" });

  // Copy favicon files and manifest file
  eleventyConfig.addPassthroughCopy({ "_assets/icons": "/" });
  eleventyConfig.addPassthroughCopy({ "_assets/*.webmanifest": "/" });
  eleventyConfig.addPassthroughCopy({ "_assets/videos": "/videos" });

  // Copy asset images to img
  // eleventyConfig.addPassthroughCopy( {"_assets/images/**/*.svg": "/images"});
  eleventyConfig.addPassthroughCopy({ "_assets/public": "/public" });

  /**
   * Markdown Setup
   */

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
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
        class: 'external-link',
        target: '_blank',
        rel: 'noreferrer'
    }
  });

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
