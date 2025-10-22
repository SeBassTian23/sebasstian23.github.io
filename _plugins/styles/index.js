import path from "path";
import fs from "fs";
import * as sass from "sass";
import CleanCSS from "clean-css";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

// Get relative path from cwd
const pathRel = (file) => path.relative(process.cwd(), file);

// Minify CSS using CleanCSS
const minifyCSS = (css, options = {}) => {
  const minified = new CleanCSS(options).minify(css);
  
  if (!minified.styles) {
    console.error("Error minifying CSS:", minified.errors);
    return css; // Return unminified on error
  }
  
  return minified.styles;
};

// Process CSS with PostCSS (autoprefixer)
const processPostCSS = async (css) => {
  const result = await postcss([autoprefixer]).process(css, { from: undefined });
  return result.css;
};

// Compile a single SCSS file
const compileSCSS = (filePath, options = {}) => {
  try {
    const result = sass.compile(filePath, options);
    return {
      css: result.css,
      loadedUrls: result.loadedUrls,
      success: true,
    };
  } catch (error) {
    console.error(`SCSS compilation error in ${filePath}:`, error.message);
    return {
      css: `/* SCSS Error: ${error.message} */`,
      error: error.message,
      success: false,
    };
  }
};

// Main SCSS Plugin for Eleventy 3
export default function scssPlugin(eleventyConfig, options = {}) {
  // Default configuration
  const config = {
    entryPoints: {},
    outputDir: null,
    sassOptions: {
      loadPaths: ["_assets/scss", "node_modules"],
      style: "compressed",
      silenceDeprecations: ["import","color-functions", "global-builtin"], // Bootstrap related
    },
    minify: true,
    autoprefixer: true,
    ...options,
  };

  // Check if we have entry points
  if (Object.keys(config.entryPoints).length === 0) {
    console.log("No SCSS entry points defined");
    eleventyConfig.addGlobalData("scss", {});
    return;
  }

  let compiledData = {};
  let watchedPaths = new Set();

  // Compile all SCSS entry points
  const compileAll = async () => {
    const data = {};
    const allWatchPaths = new Set();

    for (const [key, filePath] of Object.entries(config.entryPoints)) {
      console.log(`Compiling ${key}: ${filePath}`);

      // Compile SCSS
      const result = compileSCSS(filePath, config.sassOptions);
      
      if (!result.success) {
        data[key] = result.css;
        continue;
      }

      let css = result.css;

      // Apply PostCSS (autoprefixer)
      if (config.autoprefixer) {
        css = await processPostCSS(css);
      }

      // Minify CSS
      if (config.minify) {
        css = minifyCSS(css);
      }

      // Write to file if output directory specified
      if (config.outputDir) {
        const outputPath = path.join(config.outputDir, `${key}.css`);
        fs.mkdirSync(config.outputDir, { recursive: true });
        fs.writeFileSync(outputPath, css);
        console.log(`Written to ${outputPath}`);
      }

      // Track dependencies for watch mode
      if (result.loadedUrls) {
        result.loadedUrls.forEach(url => {
          if (url.protocol === "file:") {
            const filePath = url.pathname;
            allWatchPaths.add(pathRel(filePath));
          }
        });
      }

      data[key] = css;
    }

    // Add all watch targets
    allWatchPaths.forEach(watchPath => {
      if (!watchedPaths.has(watchPath)) {
        eleventyConfig.addWatchTarget(watchPath);
        watchedPaths.add(watchPath);
      }
    });

    return data;
  };

  // Compile on first run and cache
  let buildCounter = 0;
  let lastCompile = 0;

  eleventyConfig.on("eleventy.before", async () => {
    compiledData = await compileAll();
  });

  eleventyConfig.on("eleventy.after", () => {
    buildCounter++;
  });

  // Add global data with caching
  eleventyConfig.addGlobalData("scss", async () => {
    if (lastCompile !== buildCounter) {
      lastCompile = buildCounter;
      compiledData = await compileAll();
    }
    return compiledData;
  });

  // Recompile on file changes
  eleventyConfig.on("eleventy.beforeWatch", async (changedFiles) => {
    const changedPaths = changedFiles.map(file => pathRel(file));
    
    // Check if any watched SCSS files changed
    const shouldRecompile = changedPaths.some(changed => 
      Array.from(watchedPaths).includes(changed)
    );

    if (shouldRecompile) {
      console.log("SCSS files changed, recompiling...");
      compiledData = await compileAll();
    }
  });

  // Optional: Add paired shortcode for inline SCSS
  eleventyConfig.addPairedShortcode("scss", async (content) => {
    try {
      const result = sass.compileString(content, config.sassOptions);
      let css = result.css;

      if (config.autoprefixer) {
        css = await processPostCSS(css);
      }

      if (config.minify) {
        css = minifyCSS(css);
      }

      return css;
    } catch (error) {
      console.error("Inline SCSS error:", error.message);
      return `/* Error: ${error.message} */`;
    }
  });
}
