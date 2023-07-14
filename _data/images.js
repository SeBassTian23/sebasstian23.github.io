const fs = require("fs");
const path = require('path');

const pluginImage = require("@11ty/eleventy-img");
const shorthash = require("short-hash");

const imageSizes = "(min-width: 1024px) 100vw, 50vw"; //'(max-width: 768px) 100vw, 768px'
const imageWidths = [600, 900, 1500];
const imageFormats = ['webp', 'jpeg'];

module.exports = {
  /**
   * 
   * @param {*} src 
   * @param {*} alt 
   * @param {*} sizes 
   * @param {*} addClass 
   * @returns 
   */
  imageHTML(src, alt, sizes = "100%", addClass = "img-fluid") {
    if (alt === undefined) {
      alt = "";
      // You bet we throw an error on missing alt (alt="" works okay)
      // throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }
    let options = {
      widths: imageWidths,
      // .concat(imageWidths.map((w) => w * 2))         // generate 2x sizes for retina displays
      // .filter((v, i, s) => s.indexOf(v) === i),
      formats: imageFormats,
      sizes: imageSizes,                             // choose your own formats (see docs)
      urlPath: '/images',                            // src path in HTML output
      outputDir: './_site/images/',                   // where the generated images will go
      svgShortCircuit: true
    };

    let urlParameters = {
      width: null,
      float: null,
      class: null
    };

    // Split to separate link and parameters/anchors
    let srcOriginal = src;
    let im = src.split(/#|\?/);
    src = path.join('./_assets', im[0]);
  
    if(!fs.existsSync(src))
      return "";

    if( im[1] ){
      let params = [...srcOriginal.matchAll(/(?:\?|\&)(?<key>[\w]+)(?:\=|\&?)(?<value>[\w+,.-]*)/g)];
      params.forEach( (x) => {
        if(x.groups.key == "width" || x.groups.key == "w")
          urlParameters.width = x.groups.value;
        if(x.groups.key == "float" || x.groups.key == "f")
          urlParameters.float = x.groups.value;
        if(x.groups.key == "class" || x.groups.key == "c")
          urlParameters.class = x.groups.value;
      });
    }

    if(im[1] && im[1].match(/^s=/))
      sizes = im[1].split("=")[1] || sizes;
  
    // Passthrough SVGs since it is not done properly 
    // using the standard function
    if (src.match(/\.svg$/)) {
      var basename = path.basename(src);
      var hashname = `${shorthash(basename)}.svg`;
      var outputPath = path.join(options.outputDir, hashname);
      if (!fs.existsSync(options.outputDir))
        fs.mkdirSync(options.outputDir);
      fs.copyFileSync(src, outputPath);
      var svg = {
        svg: [
          {
            format: 'svg',
            width: sizes,
            height: 'auto',
            url: path.join(options.urlPath, hashname),
            sourceType: 'image/svg',
            srcset: `${path.join(options.urlPath, hashname)} ${sizes}`,
            filename: hashname,
            outputPath: outputPath
          }
        ]
      };
      return pluginImage.generateHTML(svg, {
        alt: alt,
        class: addClass,
        sizes: imageSizes,
        loading: 'lazy',
        decoding: 'async'
      });
    }
  
    // Generate Image
    pluginImage(src, options);
  
    // Generate HTML container for image
    let metadata = pluginImage.statsSync(src, options);
    let html = pluginImage.generateHTML(metadata, {
      alt: alt,
      class: urlParameters.class? `${urlParameters.class} ${addClass}` : addClass,
      sizes: imageSizes,
      loading: 'lazy',
      decoding: 'async'
    });
  
    if ( urlParameters.float == 'start')
      return `<div class="post-inline-img col-md-6 float-md-start mb-3 me-md-3">${html}</div>`;
    if ( urlParameters.float == 'end')
      return `<div class="post-inline-img col-md-6 float-md-end mb-3 ms-md-3">${html}</div>`;
    return html;
  },
  /**
   * 
   * @param {*} src 
   * @param {*} format 
   * @param {*} size 
   * @returns 
   */
  imageResizedURL(src, format = "jpeg", size = 1200) {

    let options = {
      widths: [size],
      formats: [format],
      // sizes: imageSizes,                          // choose your own formats (see docs)
      urlPath: '/images',                            // src path in HTML output
      outputDir: './_site/images/',                  // where the generated images will go
      // sharpOptions: {},
      // sharpWebpOptions: {
      //   quality: 95
      // },
      // sharpPngOptions: {},
      // sharpJpegOptions: {},
      // sharpAvifOptions: {}
    };
  
    src = path.join('./_assets', src);
  
    // Generate Image
    pluginImage(src, options);
  
    // Generate HTML container for image
    let metadata = pluginImage.statsSync(src, options);
    return metadata[format][0];
  },
  imageSizes,
  imageWidths,
  imageFormats
};