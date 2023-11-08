/**
 * Weather Widget to get latest data from Weather station
 * 
 * Station data hosted at: https://average-apron-clam.cyclic.app/
 */

class WeatherWidget {
  constructor(selector,token) {
    this.selector = selector || null;
    this.units = window.navigator.language == "en-US"? 'imperial': 'metric'
    this.colors = {
      muted: 'rgba(33, 37, 41, 0.65)',
      border: 'inherit', // 'rgba(33, 37, 41, 0.15)',
      primary: '#457b9d'
    }
    this.options = {
      method: 'GET'
    };
    this.humidityIcon = `<svg xmlns="http://www.w3.org/2000/svg" width=".75rem" height=".75rem" fill="currentColor" class="bi bi-moisture" viewBox="0 0 16 16">
      <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5h-2zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a28.458 28.458 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a28.458 28.458 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001L7 1.5zm0 0-.364-.343L7 1.5zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267z"></path>
      </svg>`;
    this.pressureIcon = `<svg xmlns="http://www.w3.org/2000/svg" width=".75rem" height=".75rem" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
      <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z"></path>
      <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"></path>
      </svg>`;
  }
  timestamp(isoString, tz){
    isoString = new Date(isoString)
    var language = navigator.language || navigator.userLanguage || 'en-US'
    const str = new Intl.DateTimeFormat(language, { 
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: tz,
      timeZoneName: 'short'
    }).format(isoString)
    return `<div class="ww-time">${str}</div>`;
  }
  temperature(value, units){
    if(!isNaN(Number(value))){
      if(units == 'metric')
        value = value.toFixed(2)+'℃'
      if(units == 'imperial')
        value = (value * 1.8 + 32).toFixed(2)+'℉'
      if(units == 'si')
        value = (value + 273.15).toFixed(2)+'K'
    }
    else{
      value = 'N/A'
    }
    return `<div class="ww-temperature">${value}</div>`
  }
  description(title,description){
    return `<div class="ww-location">${title} | ${description}</div>`
  }
  aqicolor(value){
    if (value >= 301) return "rgb(76, 0, 38)";
    if (value >= 201 && value <= 300) return "rgb(153, 0, 76)";
    if (value >= 151 && value <= 200) return "rgb(255, 0, 0)";
    if (value >= 101 && value <= 150) return "rgb(255, 126, 0)";
    if (value >= 51 && value <= 100) return "rgb(255, 243, 0)";
    if (value >= 0 && value <= 50) return "rgb(0, 228, 0)";
    return "transparent"
  }
  uvcolor(value){
    if (value >= 11) return "rgb(178, 102, 161)";
    if (value >= 8 && value <= 10) return "rgb(215, 46, 15)";
    if (value >= 6 && value <= 7) return "rgb(241, 138, 0)";
    if (value >= 3 && value <= 5) return "rgb(255, 243, 0)";
    if (value >= 0 && value <= 2) return "rgb(61, 164, 44)";
    return "transparent"
  }
  parameterlist(humidity, pressure, aqi, uv, units = 'metric'){

    humidity = (!isNaN(Number(humidity)))? humidity.toFixed(1)+'&nbsp;%' : 'N/A'
    aqi = (!isNaN(Number(aqi)))? aqi.toFixed(0) : 'N/A'
    uv = (!isNaN(Number(uv)))? uv.toFixed(0) : 'N/A'

    if(!isNaN(Number(pressure))){
      if(units == 'metric')
        pressure = pressure.toFixed(1)+'&nbsp;hPa'
      if(units == 'imperial')
        pressure = (pressure * 0.02952998751).toFixed(2)+'&nbsp;inHg'
      if(units == 'si')
        pressure = (pressure * 100).toFixed(2)+'&nbsp;Pa'
    }
    else{
      pressure = 'N/A'
    }

    return `<ul class="ww-parameters-list">`
          + `<li class="ww-parameters-list-item">${this.humidityIcon} ${humidity}</li>`
          + `<li class="ww-parameters-list-item">${this.pressureIcon} ${pressure}</li>`
          + `<li class="ww-parameters-list-item">AQI: <span>${aqi} <span style="color:${this.aqicolor(aqi)};font-size:0.5rem;">●</span></span></li>`
          + `<li class="ww-parameters-list-item">UV: <span>${uv} <span style="color:${this.uvcolor(uv)};font-size:0.5rem;">●</span></span></li>`
          + `</ul>`
  }
  styles(){
    return `
      .ww-parameters-list {
        flex: 1;
        align-items: center;
        padding-left:0;
        list-style:none;
        font-size:.75rem;
        font-weight:400;
        column-count:2;
        gap:1.75rem;
        margin:0;
        padding:0 0.5rem 0 0.5rem;
        color: inherit;
        border-left: 1px solid ${this.colors.primary};
      }
      .ww-parameters-list-item {
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
      }
      .ww-parameters-list-item svg {
        margin: 3px 5px 0px 0px;
      }
      .weather-widget-container {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
        width: auto;
      }
      .ww-temperature {
        font-size: 1.8rem;
        color: ${this.colors.primary};
        flex: 1;
        align-items: center;
        text-align: right;
        line-height: 2.3rem;
      }
      .ww-location {
        font-weight:600;
        font-size:.85rem;
        color:${this.colors.primary};
      }
      .ww-time {
        font-size:.75rem;
        font-weight:400;
        color: inherit;
        flex: 1;
        align-items: center;
      }
      .ww-loc-time-container {
        flex: 1;
        align-items: center;
      }
    `
  }
  init() {
    fetch(`https://average-apron-clam.cyclic.app/data/widget`, this.options)
    .then(response => response.json())
    .then(response => {
      // Construct Widget
      var html = `<div class="weather-widget-container">`
              + `<div>${this.timestamp(response.body.created_at, response.body.timezone)}${this.description(response.body.title,response.body.description)}</div>`
              + this.temperature(response.body['Temperature [C]'], this.units)
              + this.parameterlist(response.body['rel. Humidity [%]'], response.body['Pressure (PMSL) [hPa]'],response.body['AQI'],response.body['UV-Index'], this.units)
              + `</div>`
      if(response){
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = this.styles();
        document.head.appendChild(style);
        document.querySelector(this.selector).innerHTML = html;
      }
    })
    .catch(err => console.error(err));
  }
}
