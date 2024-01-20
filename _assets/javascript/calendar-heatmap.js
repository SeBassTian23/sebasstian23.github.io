let applyUpdate = (settings) => {
  for (let name in settings) {
    let el = document.querySelector(`input[name="${name}"]`)
    if (!el)
      continue;
    if (el.checked !== null)
      el.checked = settings[name] == 'true' ? true : false;
    else
      el.value = settings[name]
  }
  document.querySelector('#svg').innerHTML = calendarheatmap.build();
  document.querySelector('#svg svg').classList.add("img-fluid");
  document.querySelector('#svg svg').alt = 'Scheme of the photosynthetic machinery of higher plants.';
}

// Initiate
const calendarheatmap = new CalendarHeatmap();

// Figure container
document.querySelector('#svg').innerHTML = calendarheatmap.build();

applyUpdate(Object.fromEntries([]))

// Figure settings
document.querySelector('#settings').innerHTML = calendarheatmap.settingsHTML();

// Figure presets
document.querySelector('#presets').innerHTML = calendarheatmap.presetsHTML();

// Capture form changes
document.querySelector('#settings form').addEventListener("change", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target.form) || {}

  document.querySelectorAll('#settings form input[type=checkbox]').forEach(el => {
    if (!el.checked)
      formData.append(el.name, false)
  });
  calendarheatmap.update(Object.fromEntries(formData));
  applyUpdate(Object.fromEntries(formData));
});

document.querySelector('#download-svg').addEventListener('click', (event) => {
  event.preventDefault();

  let svg = calendarheatmap.build();

  let blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  let URL = window.URL || window.webkitURL || window;

  const download_evt = new MouseEvent('click');
  const a = document.createElement('a');
  a.download = 'calendarheatmap.svg';
  a.href = URL.createObjectURL(blob);
  a.dispatchEvent(download_evt);
});

document.querySelector('#download-png').addEventListener('click', (event) => {
  event.preventDefault();
  const canvas = document.createElement("canvas");
  const svg = document.querySelector('#svg svg');
  const base64doc = btoa(unescape(encodeURIComponent(calendarheatmap.build())));
  const w = parseInt(svg.getAttribute('width')) * 2;
  const h = parseInt(svg.getAttribute('height')) * 2;
  const img_to_download = document.createElement('img');
  img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
  img_to_download.onload = function () {
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    context.drawImage(img_to_download, 0, 0, w, h);
    const dataURL = canvas.toDataURL('image/png');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "calendarheatmap.png");
      e.preventDefault();
    } else {
      const a = document.createElement('a');
      const my_evt = new MouseEvent('click');
      a.download = 'calendarheatmap.png';
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
    // canvas.parentNode.removeChild(canvas);
  }
});

document.querySelector('#download-json').addEventListener('click', (event) => {
  event.preventDefault();

  const formData = new FormData(document.querySelector('#settings form')) || {}

  document.querySelectorAll('#settings form input[type=checkbox]').forEach(el => {
    if (!el.checked)
      formData.append(el.name, false)
  });

  let settings = JSON.stringify(Object.fromEntries(formData), null, 2);

  let blob = new Blob([settings], { type: 'text/json;charset=utf-8' });
  let URL = window.URL || window.webkitURL || window;

  const download_evt = new MouseEvent('click');
  const a = document.createElement('a');
  a.download = 'calendarheatmap.json';
  a.href = URL.createObjectURL(blob);
  a.dispatchEvent(download_evt);
});

document.querySelector('#backup-click').addEventListener('click', () => document.querySelector('#import-json').click())

document.querySelector('#import-json').addEventListener('change', (event) => {

  if (event.target.files[0]) {

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function () {
      let importedSettings = JSON.parse(reader.result);
      calendarheatmap.update(importedSettings);
      applyUpdate(importedSettings);
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
  }
});

var msgModal = new bootstrap.Modal(document.getElementById('msgModal'), {})

document.querySelector('#import-data').addEventListener('change', (event)=> {
  if (event.target.files[0]) {

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function () {
      if(calendarheatmap.importData(reader.result)){
        document.querySelector('#msgModal h5').innerHTML = "Import Error"
        document.querySelector('#msgModal p').innerHTML = "The file content seems not to be in the correct format. CSV and JSON are supported."
        msgModal.show()
      }
      else{
        let colName = "Unknown"
        calendarheatmap.settings.forEach( e => {
          if(e.id == 'data-input')
            e.options.forEach( (e,i) => {
              // Empty selection options
              document.querySelector(`select[name="data-input.options[${i}].${e.name}"]`).innerHTML = "";

              // Disable imported data
              if(document.querySelector(`input[name="data-input.show"]`).checked)
                document.querySelector(`input[name="data-input.show"]`).click();

              let content = e.options.map( (e,idx) => `<option value="${e}"${ i==idx? 'selected': ''}>${e}</option>`);
                colName = e.options[1] || "Unknown"
              // Add new selection options
              document.querySelector(`select[name="data-input.options[${i}].${e.name}"]`).innerHTML = content;
            })
        })

        // Add second column as Title
        document.querySelector(`input[name="title.options[0].titleText"]`).value = `Heatmap of ${colName}`;

        // Add filename as subtitle
        document.querySelector(`input[name="subtitle.options[0].titleText"]`).value = file.name;
        
        // Add a click event to the data to trigger an update
        document.querySelector(`input[name="data-input.show"]`).click();
      }
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
  }
});

document.querySelector('#presets-selector').addEventListener('change', (event) => {
  calendarheatmap.reset();
  calendarheatmap.update(calendarheatmap.getPreset(event.target.value));
  applyUpdate(calendarheatmap.getPreset(event.target.value));
});

document.querySelector('#reset-form').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#settings form').reset();
  document.querySelector('#presets-selector').value = '-1';
  calendarheatmap.reset();
  document.querySelector('#svg').innerHTML = calendarheatmap.build();
  applyUpdate(Object.fromEntries([]));
});

document.querySelector('#toggleBtn').addEventListener('click', (event) => {
  let el = document.querySelector('#settings-container');

  if(!el.classList.contains('d-none')){
    el.classList.add('d-none');
    document.querySelector('#toggleBtn svg.bi-arrows-angle-expand').classList.add('d-none')
    document.querySelector('#toggleBtn svg.bi-layout-sidebar-reverse').classList.remove('d-none')
    document.querySelector('#top-menu').classList.add('col-7','col-md-9')
  }
  else{
    el.classList.remove('d-none');
    document.querySelector('#toggleBtn svg.bi-arrows-angle-expand').classList.remove('d-none')
    document.querySelector('#toggleBtn svg.bi-layout-sidebar-reverse').classList.add('d-none')
    document.querySelector('#top-menu').classList.remove('col-7','col-md-9')
  }
})
