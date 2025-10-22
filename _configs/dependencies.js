export default [

  // Copy css dependencies
  // { "./node_modules/prismjs/themes/": "/css/prism" },
  // { "_assets/scss/base/prism-theme.css": "/css/prism.css" },

  // Copy javascript dependencies
  { "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "./javascript/bootstrap.bundle.min.js" },
  { "_assets/javascript/*.js": "./javascript/" },

  // Photosynthesis Scheme
  { "./node_modules/photosynthesis-scheme/dist/photosynthesis.min.js": "./javascript/photosynthesis.min.js" },
  { "./node_modules/photosynthesis-scheme/public/js/main.js": "./javascript/ps-app.js" },

  // Calendar Heatmap
  { "./node_modules/calendar-heatmap/dist/calendarheatmap.min.js": "./javascript/calendarheatmap.min.js" },
  { "./node_modules/calendar-heatmap/public/js/main.js": "./javascript/chm-app.js" },

  // Copy font files
  { "./node_modules/bootstrap-icons/font/fonts": "/css/fonts" },

  // Copy favicon files and manifest file
  { "_assets/icons": "/" },
  { "_assets/*.webmanifest": "/" },
  { "_assets/videos": "/videos" },

  // Copy asset images to img
  { "_assets/public": "/public" },

  // Copy CNAME
  { "_assets/CNAME": "CNAME" }
]
