import fs from "fs";
import path from "path";

import Image from "@11ty/eleventy-img";

export const imageSizes = "(min-width: 1200px) 1320px, (min-width: 768px) 100vw, 100vw"; //"(min-width: 1024px) 100vw, 50vw"; //'(max-width: 768px) 100vw, 768px'
export const imageWidths = [320, 640, 1024, 1320];
export const imageFormats = ['webp', 'jpeg'];

/**
 * 
 * @param {*} src 
 * @param {*} alt 
 * @param {*} sizes 
 * @param {*} addClass 
 * @returns 
 */
export const imageHTML = (src, alt = "", sizes = "100%", addClass = "img-fluid") => {

  let params = {}
  let tag;

  // Check if the source is local or remote
  if (!src.match(/^https?:\/\//)) {

    // Add assets folder to path
    src = path.join('./_assets', src);

    // Check if the path has a url tag
    tag = src.split('#');
    if (tag.length > 1) {
      tag = tag[1]
      src = tag[0]
    }
    else
      tag = null;

    // Check if the local file path has url parameters
    if (src.split('?').length > 1) {
      params = Object.fromEntries([...src.matchAll(/(?:\?|\&)(?<key>[\w]+)(?:\=|\&?)(?<value>[\w+,.-]*)/g)].map(e => {

        let key = e[1];
        switch (e[1][0]) {
          case 'f':
            key = "float"
            break;
          case 'w':
            key = "width"
            break;
          case 'c':
            key = "class"
            break;
          case 's':
            key = "size"
            break;
        }

        return [key, decodeURIComponent(e[2])]
      }))
      src = src.split('?')[0]
    }

    // Check if the local file exists
    if (!fs.existsSync(src))
      return ""
  }

  // Change settings if SVG
  if(src.endsWith('.svg')){
    params.widths = ["auto"]
    params.formats = ["svg"]
  }

  let options = {
    widths: params?.widths || imageWidths,
    formats: params?.formats || imageFormats,
    sizes: imageSizes,
    urlPath: '/images',
    outputDir: './_site/images/',
    svgShortCircuit: true,
    svgAllowUpscale: true,
    fixOrientation: true,
    sharpOptions: {
      animated: true,
    },
    cache: true,
    htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
			pictureAttributes: {}
		}
  };

  // Generate Image
  Image(src, options);

  // Add Params
  if (params?.float)
    addClass += ` post-inline-img col-md-6 float-md-${params.float} mb-3 m${params.float[0] == 'e' ? 's' : 'e'}-md-3`

  // Generate HTML container for image
  let metadata;
  if (src.match(/^https?:\/\//)) {
    metadata = Image.statsByDimensionsSync(src, Math.max(...imageWidths), Math.max(...imageWidths), options);
  }
  else
    metadata = Image.statsSync(src, options);

  if(metadata.svg){
    metadata.svg = metadata.svg.map( el => {
      return {
        ...el,
        ...{
          height: 'auto', 
          width: Number(params.size) || el.width
        }
      }
    });
  }

  let html = Image.generateHTML(metadata, {
    alt: alt,
    class: params.class ? `${params.class} ${addClass}` : addClass,
    sizes: params?.sizes || imageSizes,
    loading: 'lazy',
    decoding: 'async'
  });

  return html;
}

/**
 * 
 * @param {*} src 
 * @param {*} format 
 * @param {*} size 
 * @returns 
 */
export const imageResizedURL = (src, format = "jpeg", size = 1200) => {

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

  if (!src.match(/^https?:\/\//))
    src = path.join('./_assets', src);

  // Generate Image
  Image(src, options);

  // Generate HTML container for image
  let metadata = Image.statsByDimensionsSync(src, size, size, options);
  return metadata[format][0];
}


/**
 * Get all file paths from an album folder or album array
 * @param {*} src 
 * @returns
 */
export const album = (src) => {
  // Check if it is a string or array 
  if (!Array.isArray(src)) {
    src = [src];
  }

  let imagefiles = [];

  for (let i in src) {

    let content = path.join('./_assets', src[i]);

    if (!fs.existsSync(content))
      continue;

    if (fs.lstatSync(content).isDirectory()) {
      let files = fs.readdirSync(content)
        .filter((e) => ['.jpg', '.jpeg', '.png', '.gif', '.webp', 'tiff', 'avif', 'svg'].includes(path.extname(e).toLowerCase()))
        .map((e) => path.join(src[i], e));
      imagefiles = [...imagefiles, ...files]
    }

    if (fs.lstatSync(content).isFile()) {
      imagefiles.push(src[i])
    }
  }
  return imagefiles;
}


/**
 * Find title image in album by aspect ratio
 */
export const titleImgFromAlbum = (src) => {

  // Get all album images
  src = album(src)

  let aspectRatio = 1;
  let selected = null;

  for(let i in src){
    let imgPath = path.join('_assets', src[i] );
    if( fs.existsSync( imgPath ) ){
      let img = Image.statsSync(imgPath, {
        fixOrientation: true
      });
      let keys = Object.keys(img)
      if(keys.length > 0){
        if(img[keys[0]].length > 0){
          let w = Number(img[keys[0]][0]?.width)
          let h = Number(img[keys[0]][0]?.height)
          let r = w / h;
          if(r > aspectRatio){
            aspectRatio = r
            selected = src[i]
          }
        }
      }
    }
  }

  return selected;
}