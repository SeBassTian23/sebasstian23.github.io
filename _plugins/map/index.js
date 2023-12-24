const fs = require('fs');
const path = require('path');
const generateMap = require('./map');

module.exports = {
  initArguments: {},
  configFunction: function (eleventyConfig, options = {}) {
    eleventyConfig.addFilter('map', (content, opts, file=null) => {
        let map = generateMap(content,{...options,...opts})
        if(file){
          if(file=='base64')
            return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(map)))
          else{
            if(!fs.existsSync( path.join(process.cwd(),'_assets','images','maps') ))
              fs.mkdirSync( path.join(process.cwd(),'_assets','images','maps') );
            fs.writeFileSync(path.join(process.cwd(),'_assets','images','maps',`${file}.svg`), map)
            return path.join('images','maps',`${file}.svg`)
          }
        }
        return map;
    })
  }
};