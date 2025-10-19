// Initiate
const calendarheatmap = new CalendarHeatmap("#svg");

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

  let settings = {}
  for (const [key, value] of formData.entries()) {
    const keys = key.split('.');

    // Create category key, if it doesn't exist
    if( settings[keys[0]] === undefined)
      settings[keys[0]] = {}

    // Add key and value to category
    if(value === "false" || value === "true" || value === "null")
      settings[keys[0]][keys[1]] = JSON.parse(value);
    else if(!isNaN(value) && value.trim() !== '')
      settings[keys[0]][keys[1]] = Number(value);
    else
      settings[keys[0]][keys[1]] = value;
  }

  calendarheatmap.settings = settings
  calendarheatmap.update();
});

document.querySelector('#download-svg').addEventListener('click', (event) => {
  event.preventDefault();

  let svg = document.querySelector('#svg').getHTML()

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
  const svgHTML = document.querySelector('#svg').getHTML()
  const base64doc = btoa(unescape(encodeURIComponent( svgHTML )));
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
  }
});

document.querySelector('#download-json').addEventListener('click', (event) => {
  event.preventDefault();

  let settings = JSON.stringify(calendarheatmap.settingsSave, null, 2);

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
      document.querySelector('#settings form').reset();
      document.querySelector('#presets-selector').value = '-1';
      calendarheatmap.reset();
      calendarheatmap.settings = importedSettings;
      calendarheatmap.update();
      updateForm();
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
      if(!calendarheatmap.importData(reader.result)){
        document.querySelector('#msgModal h5').innerHTML = "Import Error"
        document.querySelector('#msgModal p').innerHTML = "The file content seems not to be in the correct format. CSV and JSON are supported."
        msgModal.show()
      }
      else{
        // Add selection options
        document.querySelector(`select[name="data-input.dateColumn"]`).innerHTML = calendarheatmap.headers.map( 
          header => `<option value="${header}" ${calendarheatmap.settings['data-input'].dateColumn === header? 'selected': ''}>${header}</option>`
        ).join('\n');
        
        document.querySelector(`select[name="data-input.valueColumn"]`).innerHTML = calendarheatmap.headers.map(
          header => `<option value="${header}" ${calendarheatmap.settings['data-input'].valueColumn === header? 'selected': ''}>${header}</option>`
        ).join('\n');

        // Add second column as Title
        document.querySelector(`input[name="title.titleText"]`).value = `Heatmap of ${calendarheatmap.settings['data-input'].valueColumn || "Unknown"}`;

        // Add filename as subtitle
        document.querySelector(`input[name="subtitle.titleText"]`).value = file.name;
        
        // Add a click event to the data to trigger an update
        if(!document.querySelector(`input[name="data-input.show"]`).checked){
          document.querySelector('#settings input[name="data-input.show"]').checked = true;
          document.querySelector('#settings input[name="data-input.show"]').dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
  }
});

document.querySelector('#presets-selector').addEventListener('change', (event) => {
  calendarheatmap.reset();
  calendarheatmap.applyPreset(event.target.value);
  calendarheatmap.update();
  updateForm();
});

document.querySelector('#reset-form').addEventListener('click', (event) => {
  event.preventDefault();
  // Reset Presets Selector
  document.querySelector('#presets-selector').value = '-1';
  // Reset Form
  document.querySelector('#settings form').reset();
  // If there is no data, everything can be reset
  if(calendarheatmap.data.length === 0){
    document.querySelectorAll('#settings form select').forEach( itm => itm.innerHTML = "" );
    calendarheatmap.resetSettings();
    calendarheatmap.update();
  }
  else{
    document.querySelector('#settings input[name="data-input.show"]').checked = true;
    // We use the dispatch Event here, as the reset form has data deactivated
    document.querySelector('#settings input[name="data-input.show"]').dispatchEvent(new Event('change', { bubbles: true }));
  }
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

document.querySelectorAll('input[type="range"]').forEach( e => { 
  e.title = e.value;
  e.addEventListener( 'input', (e) => {
    e.target.title = e.target.value;
  });
});  

function updateForm() {
  for (let category in calendarheatmap.settings) {
    let elements = calendarheatmap.settings[category]
    for (let e in elements) {
      let el = document.querySelector(`input[name="${category}.${e}"]`);
      if (el) {
        if (typeof elements[e] === 'boolean'){
          el.checked = elements[e]
        }
        else
          el.value = elements[e]
      }
    }
  }
}