document.addEventListener('DOMContentLoaded', function () {
  if (weather) {

    // Remove static image
    document.querySelector('#calendar-heatmap-img img').remove();

    let calendarheatmap = new CalendarHeatmap('#calendar-heatmap-img', {className:'img-fluid', autoInit: false});
    calendarheatmap.importData(weather.data);
    calendarheatmap.settings = weather.settings
    calendarheatmap.update()

    document.querySelectorAll('a[id^="heatmap-"]').forEach(a => {
      a.addEventListener('click', e => {
        // stops the default link action (navigation)
        e.preventDefault();

        // Remove active Class
        document.querySelectorAll('a[id^="heatmap-"]').forEach(a => a.classList.remove('active'))

        // Reset Heatmap settings
        calendarheatmap.settings = weather.settings;

        // Update Heatmap
        switch (e.currentTarget.id) {
          case 'heatmap-high':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = weather.views.high
            break;
          case 'heatmap-low':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = weather.views.low
            break;
          case 'heatmap-rain':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = weather.views.rain
            break;
          case 'heatmap-snow':
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = weather.views.snow
            break;
          default:
            e.currentTarget.classList.add('active');
            calendarheatmap.settings = weather.views.high
            break;
        }

        // Update Heatmap
        calendarheatmap.update();
      });
    });
  }
  else {
    document.querySelector('#calendar-heatmap-examples').remove()
  }
});