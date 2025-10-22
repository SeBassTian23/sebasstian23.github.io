// Native
import fs from "fs";
import path from "path";

// Eleventy Plugins
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import pluginTOC from "eleventy-plugin-nesting-toc";
import pugPlugin from "@11ty/eleventy-plugin-pug";


// Own Plugin based on @jamshop/eleventy-plugin-scss
import scssPlugin from "./_plugins/styles/index.js";

// Map Gernerating Plugin
const pluginMap = require('./_plugins/map');

// DayJS
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"; // TODO: Not sure why this needs a .js
dayjs.extend(utc);

// Libraries
import markdownLibrary from './_libraries/markdownLibrary.js'

// Natural Sorting
import { natsort } from "natsort-esm";

// Slugify
import slugify from "slugify";

// CSS
import purgeCssPlugin from "eleventy-plugin-purgecss";

// Helper Functions 
const {imageHTML,imageResizedURL,imageSizes,album} = require('./_data/images');
const extractExcerpt = require('./_data/helpers').extractExcerpt;

// Configurations
import serverConfigs from './_configs/server.js'
import dependencyCopies from './_configs/dependencies.js'

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

  eleventyConfig.addPlugin(scssPlugin, {
    entryPoints: { main: "_assets/scss/main.scss" },
    outputDir: "_site/css",
    minify: true,
    autoprefixer: true,
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

  // Add natural sorting
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

  eleventyConfig.addFilter("fileTime", function (filepath, dateformat = 'YYYY-MM-DD') {
    if (fs.existsSync(path.join(process.cwd(), filepath))) {
      let stats = fs.statSync(path.join(process.cwd(), filepath))
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
  eleventyConfig.addFilter("excerpt", extractExcerpt);

  /**
   * Passthrough Settings
   */
  for(let dependency of dependencyCopies){
    eleventyConfig.addPassthroughCopy(dependency);
  }

  // Markdown Library Setup
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Pug Rendering Plugin
  eleventyConfig.addPlugin(pugPlugin, {
    filters: {
      ...eleventyConfig.getFilters(),
      'markdown-it': function (text, options) {
        return markdownLibrary.render(text, options);
      },
    },
    debug: false
  });

  // Set up Server
  eleventyConfig.setServerOptions(serverConfigs);



// This named export is optional
export const config = {
  templateFormats: [
    "md",
    "njk",
    "html",
    "liquid",
    "pug"
  ],
  markdownTemplateEngine: "liquid",
  htmlTemplateEngine: "pug",
  dataTemplateEngine: false,
  pathPrefix: "/",
  dir: {
    input: "src",
    includes: "../_includes",
    data: "../_data",
    assets: "../_assets",
    output: "_site"
  }
};
