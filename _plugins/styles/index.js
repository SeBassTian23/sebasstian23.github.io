const sass = require("sass");
const CleanCSS = require("clean-css");
require("css.escape");
const path = require("path");
const fs = require("fs");
const postcss = require('postcss');
const autoprefixer = require("autoprefixer");

const pathRel = (file) => path.relative(process.cwd(), file);

/**
 * 
 * @param {*} css 
 * @param {*} options 
 * @returns 
 */
const minifyCSS = (css, options = {}) => {
  const minified = new CleanCSS(options).minify(css);
  if (!minified.styles) {
    // At any point where we return CSS if it
    // errors we try to show an overlay.
    console.error("Error minifying stylesheet.");
    console.log(minified);
    return minified.errors[0];
  }
  return minified.styles;
};

/**
 * 
 * @param {*} css 
 * @param {*} options 
 * @returns 
 */
const postCSS = (css, options = {}) => {
  css = postcss([ autoprefixer ]).process(css).css;
  return css;
};

// The input can be anything accepted by renderSync. E.g.
// {data: "css { ... }"} OR { file: "path/to.css" }

/**
 * 
 * @param {*} options 
 * @returns 
 */
const compileScss = (options) => {
  let result;
  try {
    result = sass.compile(options.file);
  } catch (error) {
    result = error;
  }

  if (!result || !result.css) {
    console.error("Error compiling stylesheet.");
    // We're using the same shape returned by renderSync
    // if css is a string result.css.toString() will still work
    return {
      ...result,
      error: result && result.message
      // css: (result) => {
      //   (result && result.message) || "Error compiling stylesheet."
      // },
    };
  }
  return result;
};

/**
 * 
 * @param {*} eleventyConfig 
 * @param {*} param1 
 * @returns 
 */
const compileScssEntryPoints = (
  eleventyConfig,
  options = {}
) => {
  let watchPaths = [];

  let scssOptions = { entryPoints = {}, output } = options.scss || {};
  let cssOptions  = options.minifyCss || {};
  let postOptions = options.postCss || {};

  if (Object.entries(entryPoints).length === 0) {
    if (eleventyConfig.addGlobalData) {
      // If the plugin is used a key may be expected by the theme
      // return an empty object if no scss
      eleventyConfig.addGlobalData("scss", {});
    }
    console.log(`No scss entryPoints found.`);
    console.log(
      `Plugin expects data to be in the shape: { entryPoints: { name: "path/to/file.scss"} }`
    );
    return;
  }
  const data = {};
  const keys = Object.keys(entryPoints);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const result = compileScss({ file: entryPoints[key], ...scssOptions });
    let css = result.css.toString();
    css = postCSS( css, postOptions );
    css = minifyCSS(css, cssOptions);
    if (output) {
      let outfile = path.join(output, `${key}.css`);
      if(!fs.existsSync(eleventyConfig.dir.output))
        fs.mkdirSync(eleventyConfig.dir.output);
      if(!fs.existsSync(output))
        fs.mkdirSync(output);
      fs.writeFileSync(outfile, css);
    }

    // We are getting the includedFiles from the SCSS renderSync result
    // We use this to add watch paths to 11ty because the CSS files
    // might be outside the project root
    // We want to capture all files use to compile scss not just the entry
    if (result && result.stats) {
      watchPaths = [
        ...watchPaths,
        ...result.stats.includedFiles.map((file) => pathRel(file)),
      ];
    } else if (result && result.file) {
      watchPaths = [...watchPaths, pathRel(result.file)];
    }
    data[key] = css;
  }

  watchPaths.forEach((watchPath) => {
    eleventyConfig.addWatchTarget(watchPath);
  });

  return { data, watchPaths };
};

const scssShortcode = (content) => {
  const result = compileScss({ data: content });
  const post = postCss( result.css.toString() );
  const minified = minifyCSS(post);
  return minified;
};


const addCachedGlobalData = (eleventyConfig, cb, key) => {
  // Compile once to prime cache (data varaiable is our cache) and add watch targets
  let data = cb();
  let buildCounter = 0;
  let lastCompile = 0;

  // After each build increment the build counter
  eleventyConfig.on("afterBuild", () => {
    buildCounter++;
  });

  // If this is a function 11ty will attempt to resolve the data
  // If it is async 11ty will add the key scss and resolve data when called
  eleventyConfig.addGlobalData(key, () => {
    // if the lastCompile can buildCounter don't match the cached data
    if (lastCompile !== buildCounter) {
      lastCompile = buildCounter;
      data = cb();
    }
    return data;
  });
}

/**
 * 
 * @param {*} eleventyConfig 
 * @param {*} options 
 */
 const stylesPlugin = (eleventyConfig, options) => {
  let watchedPaths = [];

  if (eleventyConfig.addGlobalData) {
    addCachedGlobalData(
      eleventyConfig,
      () => {
        const { data, watchPaths } = compileScssEntryPoints(
          eleventyConfig,
          options
        );
        watchedPaths = [...new Set([...watchedPaths, ...watchPaths])];
        return data;
      },
      "scss"
    );
  } else {
    const { watchPaths } = compileScssEntryPoints(eleventyConfig, options);
    watchedPaths = [...new Set([...watchedPaths, ...watchPaths])];
  }

  eleventyConfig.on("beforeWatch", (changedFiles) => {
    console.log({ watchedPaths, changedFiles: changedFiles.map((file) => pathRel(file)) });

    // Run me before --watch or --serve re-runs
    if (
      watchedPaths.some((watchPath) =>
        changedFiles.map((file) => pathRel(file)).includes(watchPath)
      )
    ) {
      const { watchPaths } = compileScssEntryPoints(eleventyConfig, options);
      watchedPaths = [...new Set([...watchedPaths, ...watchPaths])];
    }
  });

  eleventyConfig.addPairedShortcode("scss", scssShortcode);
};

stylesPlugin.scssShortcode = scssShortcode;

module.exports = stylesPlugin;