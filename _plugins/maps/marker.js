/**
 * 
 */

const degRad = 180 / Math.PI;
const radDeg = Math.PI / 180;
const radius = 6381372;
const centralMeridian = 11.50; //11.50; // Miller Projection 11.5

// Marker Generation
const mapTranslateLatLng = (lat, lng, mapWidth, projection='miller') => {

  const centralMeridian = 11.50; //11.50; // Miller Projection 11.5

  const width = mapWidth || 900;
  const height = 440.70631074413296 * (width / 900);

  const transX = 0;
  // const transY = ( (400 - 440.70631074413296 * (600/900)) / (2 * (600/900))  * (600/900) )
  const transY = 79.6468446279 * (600/900)
  const scale = 1;
  // const baseTransX = 0;
  // const baseTransY = 0;
  // const baseScale = 1;

  const left = 0;
  const top = 0;
  let bbox = [
    {"y": -12671671.123330014, "x": -20004297.151525836},
    {"y": 6930392.025135122, "x": 20026572.39474939}
  ];

  if (lng < (-180 + centralMeridian)) {
    lng += 360;
  }

  // Miller Projection
  let point = miller(lat, lng, centralMeridian);

  // Adjust to view box
  point = {
    x: (point.x - bbox[0].x) / (bbox[1].x - bbox[0].x) * width * scale,
    y: (point.y - bbox[0].y) / (bbox[1].y - bbox[0].y) * height * scale
  }

  // Adjust offsets
  point = {
      x: point.x + transX * scale + left * scale,
      y: point.y + transY * scale + top * scale
  }

  return point;
};

// Miller Projection
function miller(lat, lng, center) {
  return {
    x: radius * (lng - center) * radDeg,
    y: - radius * Math.log(Math.tan((45 + 0.4 * lat) * radDeg)) / 0.8
  };
}

// Mercator Projection
function mercator(lat, lng, center) {
  return {
    x: radius * (lng - center) * radDeg,
    y: - radius * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
  };
}

//   // Albers Equal Area Projection
//   aea(lat, lng, c) {
//     var fi0 = 0,
//         lambda0 = c * this.radDeg,
//         fi1 = 29.5 * this.radDeg,
//         fi2 = 45.5 * this.radDeg,
//         fi = lat * this.radDeg,
//         lambda = lng * this.radDeg,
//         n = (Math.sin(fi1)+Math.sin(fi2)) / 2,
//         C = Math.cos(fi1)*Math.cos(fi1)+2*n*Math.sin(fi1),
//         theta = n*(lambda-lambda0),
//         ro = Math.sqrt(C-2*n*Math.sin(fi))/n,
//         ro0 = Math.sqrt(C-2*n*Math.sin(fi0))/n;

//     return {
//       x: ro * Math.sin(theta) * this.radius,
//       y: - (ro0 - ro * Math.cos(theta)) * this.radius
//     };
//   },

//   // Lambert Conformal Projection
//   lcc(lat, lng, c) {
//     var fi0 = 0,
//         lambda0 = c * this.radDeg,
//         lambda = lng * this.radDeg,
//         fi1 = 33 * this.radDeg,
//         fi2 = 45 * this.radDeg,
//         fi = lat * this.radDeg,
//         n = Math.log(Math.cos(fi1) * (1 / Math.cos(fi2)) ) / Math.log(Math.tan(Math.PI / 4 + fi2 / 2) * (1 / Math.tan(Math.PI / 4 + fi1 / 2) )),
//         F = (Math.cos(fi1) * Math.pow(Math.tan(Math.PI / 4 + fi1 / 2 ), n )) / n,
//         ro = F * Math.pow(1 / Math.tan(Math.PI / 4 + fi / 2), n),
//         ro0 = F * Math.pow(1 / Math.tan(Math.PI / 4 + fi0 / 2), n);

//     return {
//       x: ro * Math.sin(n * (lambda - lambda0)) * this.radius,
//       y: - (ro0 - ro * Math.cos(n * (lambda - lambda0))) * this.radius
//     };
//   }

// }

  // export default function coordsToPoint(lat, lng) {
  //   const projection = Map.maps[this.params.map].projection
  //   let { x, y } = Proj[projection.type](lat, lng, projection.centralMeridian)
  //   let inset = this.getInsetForPoint(x, y)
  
  //   if (!inset) {
  //     return false
  //   }
  
  //   let bbox = inset.bbox
  
  //   x = (x - bbox[0].x) / (bbox[1].x - bbox[0].x) * inset.width * this.scale
  //   y = (y - bbox[0].y) / (bbox[1].y - bbox[0].y) * inset.height * this.scale
  
  //   return {
  //     x: x + this.transX * this.scale + inset.left * this.scale,
  //     y: y + this.transY * this.scale + inset.top * this.scale
  //   }
  // }

  export default mapTranslateLatLng;