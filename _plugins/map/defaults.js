module.exports = {
  width: 600,
  background: 'transparent',
  
  // Map
  map: 'world',
  projection: 'miller',
  
  // Area
  areaBackground: "#e1e1e1",
  areaBorder: "transparent",
  areaBorderWidth: .25,
  
  // Marker Parameters
  markerRadius: 3.5,
  markerFill: "#457b9d",
  markerStroke: "#505050",
  markerStrokeWidth: .25,
  markerScale: ['#f8f9fa', '#39a183'],
  markerScaleShow: false,
  markerPow: .2,

  // Lines
  lineStroke: '#505050', 
  lineStrokeWidth: 1.5,
  lineBend: 'curve',
  lineStyle: '4 2',

  // Labels
  labelFont: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Liberation Sans, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
  labelColor: '#000000',
  labelFontSize: '1.5rem',
  labelBackground: 'rgba(255,255,255,0.1)',
  labelOffset: null, // [x,y]

  // Legend
  legendShow: false,
  legendPosition: [480,340],
  legendSize: [100,10],
  legendStroke: "#e1e1e1",
  legendStrokeWidth: 1,
  legendTickMin: null,
  legendTickMax: null,
  legendTickColor: '#a1a1a1',
  legendTickFont: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Liberation Sans, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
  legendTickFontSize: '0.5rem',

  // Animation
  markerAnimation: false,
  markerAnimationType: 'pulse',
  markerAnimationSort: 'random',  // random, asc, desc
  markerAnimationSelect: 50,   // all, number (int), array
  markerAnimationDuration: 1.25
}