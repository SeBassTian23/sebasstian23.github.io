document.addEventListener('DOMContentLoaded', function () {

  function replaceElementWithSVG(el, svgCode) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) {
      console.error('Invalid SVG code');
      return;
    }

    // Replace the <img> in the DOM
    el.parentNode.replaceChild(svg, el);
    svg.style.width = '90%'
    svg.style.height = 'auto'
  }

  if (weather) {
    let calendarheatmap = new CalendarHeatmap();
    calendarheatmap.importData(weather.data);
    calendarheatmap.settings = weather.settings

    const selector = "#calendar-heatmap > div > div > div.col-sm-12.col-md-6.p-3.order-md-first"
    const img = document.querySelector(selector + ' img')

    replaceElementWithSVG(img, calendarheatmap.build());

    document.querySelectorAll('a[id^="heatmap-"]').forEach(a => {
      a.addEventListener('click', e => {
        // stops the default link action (navigation)
        e.preventDefault();

        // Remove active Class
        document.querySelectorAll('a[id^="heatmap-"]').forEach(a => a.classList.remove('active'))

        // Reset Heatmap settings
        calendarheatmap.resetSettings();
        calendarheatmap.settings = weather.settings

        // Update Heatmap
        switch (e.currentTarget.id) {
          case 'heatmap-high':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = {
              "data-input": { valueColumn: "High (°C)" },
              title: { titleText: "High Temperatures" },
              legend: { suffix: "°C" },
              scale: { name: "YlOrRd" }
            }
            break;
          case 'heatmap-low':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = {
              "data-input": { valueColumn: "Low (°C)" },
              title: { titleText: "Low Temperatures" },
              legend: { suffix: "°C" },
              scale: { name: "GnBu", reverse: true }
            }
            break;
          case 'heatmap-rain':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = {
              calendar: { tileShape: "rectangle (rounded)" },
              "data-input": { valueColumn: "Precip. (cm)" },
              title: { titleText: "Precipitation" },
              legend: { suffix: "cm" },
              scale: { name: "YlGnBu" }
            }
            break;
          case 'heatmap-snow':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = {
              calendar: { tileShape: "circle" },
              "data-input": { valueColumn: "Snow (cm)" },
              title: { titleText: "Snow" },
              legend: { suffix: "cm" },
              scale: { name: "PuBuGn", reverse: true }
            }
            break;
          default:
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = {
              "data-input": { valueColumn: "High (°C)" },
              title: { titleText: "High Temperatures" },
              legend: { suffix: "°C" },
              scale: { name: "YlOrRd" }
            }
        }

        // Update Heatmap
        replaceElementWithSVG(document.querySelector(selector + " svg"), calendarheatmap.build());
      });
    });
  }
  else {
    document.querySelector('#calendar-heatmap-examples').remove()
  }
});