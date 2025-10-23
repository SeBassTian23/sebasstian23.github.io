import fs from "fs";
import path from "path";
import chroma from "chroma-js";
import mapTranslateLatLng from "./marker.js";
import initArguments from "./defaults.js";
import parseLocation from "./parselocation.js";

// https://jvm-docs.vercel.app/
const generateMap = (content=[], options={}) => {
  
  // Add user settings
  options = {...initArguments, ...options}
  
  let map = fs.readFileSync(path.join(process.cwd(),'_plugins','maps','maps',`${options.map}-${options.projection}.svg`), { encoding: 'utf8', flag: 'r' })
  let markers;
  let markersElements;
  let markersAnimated;
  let lines;
  let labels;
  let defs;

  // Add content
  if(content && Array.isArray(content)){
    if(content.length > 0){

      // Parse content
      content = content.map( e => parseLocation(e) )

      // Filter out entries with known issues
      markers = content.filter( e => (e && e.latitude && e.longitude && !Array.isArray(e.latitude) && !Array.isArray(e.longitude) && e.latitude !== 0 && e.longitude !== 0 && e.latitude !== e.longitude) )

      // Filter out lines
      lines = content.filter( e => (e && e.latitude && e.longitude && Array.isArray(e.latitude) && Array.isArray(e.longitude) ) )

      // Get labels
      labels = content.filter( e => (e && e.latitude && e.longitude && !Array.isArray(e.latitude) && !Array.isArray(e.longitude) && e.name ) )

      let dataValues = [ ... new Set( markers.filter(e => e.count && !Number.isNaN(Number(e.count)) ).map( e => Math.pow(e.count, options.markerPow) ) )]

      if(dataValues.length > 0){
        markers = markers.sort( (a,b) => {
          return a.count - b.count;
        });
      }

      let colorGradient = [];
      if(options.markerScaleShow)
        colorGradient = chroma.scale(options.markerScale).domain([Math.min(...dataValues),Math.max(...dataValues)]).colors(dataValues.length)

      markers = markers.map( e => {
        let { x, y } = mapTranslateLatLng( e.latitude, e.longitude, options.width, options.projection );

        let scaleFill;
        if(dataValues.length > 0 && e.count && options.markerScaleShow){
          var min = Math.min(...dataValues);
          var max = Math.max(...dataValues);
          var valuePos = (Math.pow(e.count, options.markerPow)-min)/(max-min)
          var idx = Array.from({length: colorGradient.length}, (_, i) => ((i+1)/colorGradient.length)).findIndex( (e, i) => {    
            return (valuePos <= e)
          })
          scaleFill = colorGradient[idx]
        }

        return {
          x: x,
          y: y,
          radius: Number(e.radius) || Number(options.markerRadius),
          fill: scaleFill || e.fill || null,
          strokeColor: e.stroke || null,
          strokeWidth: e.strokeWidth || null,
          value: e.count || null,
          name: null
        };
      });

      if(markers)
        markersElements = markers.map( e => {
          if( isNaN(e.x) || isNaN(e.y) )
            return "";

          let circle = [
            `cx="${e.x.toFixed(3)}"`,
            `cy="${e.y.toFixed(3)}"`,
            `r="${(e.radius || options.markerRadius)}"`,
            `fill="${(e.fill || options.markerFill)}"`,
          ];

          return `<circle ${circle.join(" ")} />`;
        })

      if(lines)
        lines = lines.map( e => {

          let { x: xStart, y: yStart } = mapTranslateLatLng( e.latitude[0], e.longitude[0], options.width );
          let { x: xEnd, y: yEnd } = mapTranslateLatLng( e.latitude[1], e.longitude[1], options.width );

          if( isNaN(xStart) || isNaN(yStart) || isNaN(xEnd) || isNaN(yEnd) )
            return "";

          let path = [
            `M ${xStart.toFixed(3)}`,
            `${yStart.toFixed(3)}`,
          ]

          if(options.lineBend === 'curve')
            path = [ ...path,
              `C ${((xStart+xEnd)/2).toFixed(3)}`,
              `${yStart.toFixed(3)}`,
              `${((xStart+xEnd)/2).toFixed(3)}`,
              `${yEnd.toFixed(3)}`,
            ];

          if(options.lineBend === 'bezier')
            path = [ ...path,
              `Q ${ (xStart<xEnd? (xStart + (xEnd/2)) : (xEnd + (xStart/2)) ).toFixed(3)}`,
              `${-((yEnd-yStart)/2).toFixed(3)}`,
            ];

          path = [ ...path,
            `${xEnd.toFixed(3)}`,
            `${yEnd.toFixed(3)}`
          ];

          let dashed ='';
          if(options.lineStyle && options.lineStyle !== 'solid')
            dashed = ` stroke-dasharray="${options.lineStyle}"`

          // lineBend: 'straight',
          return `<path d="${path.join(" ")}"${dashed} style="fill:none;stroke:${options.lineStroke};stroke-width:${options.lineStrokeWidth}px;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;" />`;
        })

        labels = labels.map( e => {
          let { x, y } = mapTranslateLatLng( e.latitude, e.longitude, options.width );

          if( isNaN(x) || isNaN(y) )
            return "";

          let xoffset = options.markerRadius * 2;
          let yoffset = 0;

          if(options.labelOffset && !Number.isNaN(Number(options.labelOffset))){
            xoffset = Number(options.labelOffset)
          }
          else if(options.labelOffset && Array.isArray(options.labelOffset)){
            xoffset = Number(options.labelOffset[0])
            yoffset = Number(options.labelOffset[1])
          }

          if(e.offset && !Number.isNaN(Number(e.offset))){
            xoffset = Number(e.offset)
          }
          else if(e.offset && Array.isArray(e.offset)){
            xoffset = Number(e.offset[0])
            yoffset = Number(e.offset[1])
          }

          x = x + xoffset;
          y = y + yoffset;

          // lineBend: 'straight',
          return `<text filter="url(#label-box)" x="${x.toFixed(3)}" y="${y.toFixed(3)}" fill="${options.labelColor}" style="font-size:${options.labelFontSize}; font-family:${options.labelFont};">${e.name}</text>`;
        })

    }
  }

  // Apply changes to map
  map = map.replace(/width="(\d+)"/, `width="${options.width}"`)
           .replace(/height="(\d+)"/, `height="${options.width / 1.5}"`)
           .replace(/(<svg .*?)(.*?)(>)/, `$1$2 style="background-color:${options.background};">`)
           .replace(/<g fill="#e1e1e1"/, `<g fill="${options.areaBackground}" stroke="${options.areaBorder}" stroke-width="${options.areaBorderWidth}"`)

  // Add markers to map
  if(lines){
    let linesToStr = `<g class="svg-map-lines">${lines.join("")}</g>`
    map = map.replace(/(<\/svg>)$/, `${linesToStr}$1`) 
  }

  if(markers){
    let markersToStr = `<g class="svg-map-markers" stroke="${options.markerStroke}" stroke-width="${options.markerStrokeWidth}">${markersElements.join("")}</g>`
    map = map.replace(/(<\/svg>)$/, `${markersToStr}$1`)
  }

  if(labels){

    let defs =`<defs>
      <filter id="label-box" x="-5%" width="110%" y="-5%" height="110%">
        <feFlood flood-color="${options.labelBackground}"/>
        <feComposite operator="over" in="SourceGraphic"/>
      </filter>
    </defs>`

    let labelToStr = `<g class="svg-map-labels">${labels.join("")}</g>`
    map = map.replace(/(<\/svg>)$/, `${labelToStr}$1`)

    if(map.match(/(<defs>)/))
      map = map.replace(/(<defs>)/, `<defs>${defs}\n`)
    else
      map = map.replace(/(<svg .*?)(.*?)(>)/, `$1$2$3${defs}`)
  }

  if(options.legendShow){
    let legend = ``

    defs = `<linearGradient id="LegendGradientFill">`

    let legendFill = `url(#LegendGradientFill)`
    let legendColorGradient = chroma.scale(options.markerScale).colors()

    const stepPercent = 100 / (legendColorGradient.length - 1);
    legendColorGradient.forEach((color, i) => {
      defs += `<stop offset="${stepPercent * i}%" stop-color="${color}" />`
    });
    defs += `<stop offset="100%" stop-color="${legendColorGradient[legendColorGradient.length -2]}" />`
    defs += "</linearGradient>"

    let minTickPos = [
      options.legendPosition[0],
      options.legendPosition[1] + options.legendSize[1] + 10
    ]
    let maxTickPos = [
      options.legendPosition[0] + options.legendSize[0],
      options.legendPosition[1] + options.legendSize[1] + 10
    ]

    legend += `<g>`
    legend += `<rect x="${options.legendPosition[0]}" y="${options.legendPosition[1]}" width="${options.legendSize[0]}" height="${options.legendSize[1]}" fill="${legendFill}" style="stroke-width:${options.legendStrokeWidth};stroke:${options.legendStroke};" />`
    if(options.legendTickMin)
      legend += `<text x="${minTickPos[0]}" y="${minTickPos[1]}" text-anchor="start" fill="${options.legendTickColor}" style="font-size:${options.legendTickFontSize}; font-family:${options.legendTickFont};">${options.legendTickMin}</text>`;
    if(options.legendTickMax)
      legend += `<text x="${maxTickPos[0]}" y="${maxTickPos[1]}" text-anchor="end" fill="${options.legendTickColor}" style="font-size:${options.legendTickFontSize}; font-family:${options.legendTickFont};">${options.legendTickMax}</text>`;
    legend += `</g>`

    if(map.match(/(<defs>)/))
      map = map.replace(/(<defs>)/, `<defs>${defs}\n`)
    else
      map = map.replace(/(<svg .*?)(.*?)(>)/, `$1$2$3${defs}`)

    map = map.replace(/(<\/svg>)$/, `${legend}$1`)
  }

  if(options.markerAnimation){

    if(markers && options.markerAnimationType == 'pulse'){

      markersAnimated = markers

      if(options.markerAnimationSort == 'desc')
        markersAnimated = markersAnimated.reverse()

      if(options.markerAnimationSort == 'random')
        markersAnimated = markersAnimated.sort( () => Math.random() - .5 )

      if(!Number.isNaN(Number(options.markerAnimationSelect)))
        markersAnimated = markersAnimated.slice(0,parseInt(Number(options.markerAnimationSelect)))

      if(Array.isArray(options.markerAnimationSelect))
        markersAnimated = markersAnimated.filter( (el, idx) => options.markerAnimationSelect.indexOf(idx) > -1)

      defs = `<defs>
        <circle id="animatedCircle" cx="0" cy="0" r="3.5" fill="none" opacity="1" stroke="#000000" stroke-width="0.25">
          <animate attributeName="opacity" values="1;0.5;0" keyTimes="0;0.7;1" dur="${options.markerAnimationDuration}s" repeatCount="indefinite" />
          <animate attributeName="r" values="3.5;7.5%" dur="${options.markerAnimationDuration}s" repeatCount="indefinite" />
          <animate attributeName="cx"
            values="${markersAnimated.map(itm => itm.x).join(';')}"
            dur="${options.markerAnimationDuration * markersAnimated.length}s" repeatCount="indefinite" calcMode="discrete" />
          <animate attributeName="cy"
            values="${markersAnimated.map(itm => itm.y).join(';')}"
            dur="${options.markerAnimationDuration * markersAnimated.length}s" repeatCount="indefinite" calcMode="discrete" />
          <animate attributeName="fill"
            values="${markersAnimated.map(itm => itm.fill).join(';')}"
            dur="${options.markerAnimationDuration * markersAnimated.length}s" repeatCount="indefinite" />
        </circle>
      </defs>`
    }
    if(map.match(/(<\/defs>)/))
      map = map.replace(/(<\/defs>)/, `<\/defs>\n${defs}\n`)
    else
      map = map.replace(/(<svg .*?)(.*?)(>)/, `$1$2$3${defs}`)

    let markersUseAnimation = `<g><use href="#animatedCircle" /></g>\n`
    map = map.replace(/(<g class="svg-map-markers")/, `${markersUseAnimation}$1`)

  }

  return map;
}

export default generateMap