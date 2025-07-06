/**
 * Periodic Table plugin for the Knowledge Base
 */

class PeriodicTableElements {
  constructor(selector, elements) {
    this.elements = elements;
    this.selector = selector;
    this.selectedProperty = "GroupBlock";
    this.selectedColor = 50;
    this.GroupBlock = {
        "Nonmetal": "rgba(255, 255, 197, 1)",
        "Noble gas": "rgba(255, 224, 191, 1)",
        "Alkali metal": "rgba(255, 202, 199, 1)",
        "Alkaline earth metal": "rgba(207, 207, 255, 1)",
        "Metalloid": "rgba(220, 235, 191, 1)",
        "Halogen": "rgba(255, 255, 197, 1)",
        "Post-transition metal": "rgba(202, 255, 196, 1)",
        "Transition metal": "rgba(190, 217, 255, 1)",
        "Lanthanide": "rgba(194, 255, 255, 1)",
        "Actinide": "rgba(200, 255, 233, 1)"
    };
    this.StandardState = {
      "Solid": "rgba(219, 219, 219, 1)",
      "Liquid": "rgba(254,191,196, 1)",
      "Gas": "rgba(	193, 255, 254, 1)",
      "Expected to be a Solid": "rgba(250, 250, 250, 1)",
      "Expected to be a Gas": "rgba(237, 255, 254, 1)",
      "Expected to be a Liquid": "rgba(255, 235, 237, 1)"
  };
    this.properties = [
      "AtomicMass",
      "CPKHexColor",
      "OxidationStates",
      "Electronegativity",
      "AtomicRadius",
      "IonizationEnergy",
      "ElectronAffinity",
      "StandardState",
      "MeltingPoint",
      "BoilingPoint",
      "Density",
      "GroupBlock",
      "YearDiscovered"
    ];
  }
  get propertyOptions(){
    return this.properties;
  }
  get property(){
    return this.selectedProperty;
  }
  set property(property){
    this.selectedProperty = this.properties.indexOf(property) > -1? property : "GroupBlock";
  }
  propertyColor(el){
    if(this.selectedProperty == "CPKHexColor")
      return el.CPKHexColor != ""? el.CPKHexColor : 'none';
    else if(this.selectedProperty == "GroupBlock")
      return this.GroupBlock[el.GroupBlock];
    else if(this.selectedProperty == "StandardState")
      return this.StandardState[el.StandardState];
    else if(this.property == "AtomicRadius")
      return `radial-gradient(circle, hsl(${this.selectedColor},100%,50%) 0%, hsl(${this.selectedColor},100%,50%) ${parseInt( r * 60 )*0.8}%, #ffffffe6 ${parseInt( r * 60 )}%)`;
    else if(this.property == "OxidationStates"){
      try{
        let oxstates = el.OxidationStates.slice(0).split(',').map(itm => {
          if(Number(itm) < 0)
            return `hsl(${parseInt(this.selectedColor * 0.299)}, 100%, ${parseInt( 75 - Number(itm) * 6.25 * -1 )}%)`;
          return `hsl(${this.selectedColor}, 100%, ${parseInt( 75 - Number(itm) * 6.25 )}%)`;
        })
        return `linear-gradient(90deg, ${oxstates.join(', ')})`;
      }
      catch(e){
        return '#FFFFFF'
      }
    }
    else if(el[this.selectedProperty] == "" || Number.isNaN(Number(el[this.selectedProperty])))
      return `#FFFFFF`;
    else{
      let values = []
      for( let i in this.elements.Table.Row){
        let cell = this.elements.Table.Row[i].Cell;
        let value = Number(this.element(cell)[this.selectedProperty]);
        if( !Number.isNaN(value))
          values.push(value);
      }

      let range =[
        Math.min.apply(Math, values),
        Math.max.apply(Math, values)
      ];
      let r = ( (Number(el[this.selectedProperty])  - range[0]) / (range[1] - range[0]) );
      return `hsl(${this.selectedColor}, 100%, ${parseInt( 100 - r * 75 )}%)`;
    }
    // "Electronegativity"
    // "IonizationEnergy"
    // "ElectronAffinity"
    // "MeltingPoint"
    // "BoilingPoint"
    // "Density"
    // "GroupBlock"
    // "YearDiscovered"
  }
  propertyLabel(el){
    return el[this.selectedProperty];
  }
  hsl2rgb(h, s, l){
    // https://www.30secondsofcode.org/js/s/hsl-to-rgb
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  }
  getContrastColor(bgColor) {
    if (!bgColor || bgColor == 'none' || bgColor == '') { return '#212529'; }
    if (bgColor[0] == '#'){
      return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#212529' : '#FFFFFF';
    }
    if (bgColor.match(/rgb/i)){
      const rgba = bgColor.match(/^(?:rgba?)?[\s]?[\(]?[\s+]?(\d+)[(\s)|(,)]+[\s+]?(\d+)[(\s)|(,)]+[\s+]?(\d+)[(\s)|(,)]+[\s+]?([0-1]?(?:\.\d+)?)\)$/i)
      // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
      const luminance = rgba[1] * 0.299 + rgba[2] * 0.587 + rgba[3] * 0.114 + (1 - rgba[4]) * 255; // luminance perceived
      return luminance > 130 ? "#212529" : "#FFFFFF";
    }
    if (bgColor.match(/hsl/i)){
      const hsl = bgColor.match(/hsl\(\s?(\d+)[,\s]+(\d+)[%,\s]+(\d+)[%,\s]+\)/i)
      const rgb = this.hsl2rgb(Number(hsl[1]),Number(hsl[2]),Number(hsl[3]))
      const luminance = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
      return luminance > 130 ? "#212529" : "#FFFFFF";
    }
    return '#212529';
  }
  element(el){
    return {
        "AtomicNumber": (el[0] || ""),
        "Symbol": (el[1] || ""),
        "Name": (el[2] || ""),
        "AtomicMass": (el[3] || ""),
        "CPKHexColor": ( el[4] != ""? `#${el[4]}` : ""),
        "ElectronConfiguration": (el[5] || ""),
        "Electronegativity": (el[6] || ""),
        "AtomicRadius": (el[7] || ""),
        "IonizationEnergy": (el[8] || ""),
        "ElectronAffinity": (el[9] || ""),
        "OxidationStates": (el[10] || ""),
        "StandardState": (el[11] || ""),
        "MeltingPoint": (el[12] || ""),
        "BoilingPoint": (el[13] || ""),
        "Density": (el[14] || ""),
        "GroupBlock": (el[15] || ""),
        "YearDiscovered": (el[16] || "")
    };
  }
  elementLabel(el) {
    return `<div class="mx-auto card-element ratio mt-md-n5 pt-elements-card" data-atomicnumber="${el.AtomicNumber}" data-groupblock="${this.propertyLabel(el)}">
        <div class="border d-flex flex-column justify-content-center p-sm-1 text-center">
        <span>${el.AtomicNumber}</span>
        <span class="fs-1">${el.Symbol}</span>
        <small class="d-none d-md-block">${el.Name}</small>
        <small class="d-none d-lg-block pt-elements-f-08vw">${ this.propertyLabel(el) != ''? this.propertyLabel(el) : '&nbsp;' }</small>
      </div>
     </div>`;
  }
  elementLabelSM(el){
    return `<div class="ratio pt-elements-card-sm">
      <div class="d-flex flex-column justify-content-center">
        <span class="d-none d-sm-block pt-elements-f-1vw">${el.AtomicNumber}</span>
        <span class="d-block text-center pt-elements-f-2vw">${el.Symbol}</span>
      </div>
    </div>`;
  }
  elementInfo(el) {
    return `<ul class="list-group list-group-flush small">
        <li class="list-group-item d-flex justify-content-between">Standard State: <span>${el.StandardState}</span></li>
        <li class="list-group-item d-flex justify-content-between">Atomic Mass: <span>${el.AtomicMass} u</span></li>
        <li class="list-group-item d-flex justify-content-between">Electron Configuration: <span>${el.ElectronConfiguration}</span></li>
        <li class="list-group-item d-flex justify-content-between">Oxidation States: <span>${el.OxidationStates}</span></li>
        <li class="list-group-item d-flex justify-content-between">Electronegativity (Pauling Scale): <span>${el.Electronegativity}</span></li>
        <li class="list-group-item d-flex justify-content-between">Atomic Radius (van der Waals): <span>${el.AtomicRadius} pm</span></li>
        <li class="list-group-item d-flex justify-content-between">Ionization Energy: <span>${el.IonizationEnergy} eV</span></li>
        <li class="list-group-item d-flex justify-content-between">Electron Affinity: <span>${el.ElectronAffinity} eV</span></li>
        <li class="list-group-item d-flex justify-content-between">Melting Point: <span>${el.MeltingPoint} K</span></li>
        <li class="list-group-item d-flex justify-content-between">Boiling Point: <span>${el.BoilingPoint} K</span></li>
        <li class="list-group-item d-flex justify-content-between">Density: <span>${el.Density} g/cm³</span></li>
        <li class="list-group-item d-flex justify-content-between">Year Discovered: <span>${el.YearDiscovered}</span></li>
    </ul>`;
  }
  elementLink(el){
    return `<a href="https://pubchem.ncbi.nlm.nih.gov/element/${el.AtomicNumber}" target="_blank" class="pt-elements-modal-link" title="Details about ${el.Name} on PubChem">
        <i class="bi-box-arrow-up-right"></i>
      </a>`;
  }
  elementInfoSmall(el){
    return `<ul class="list-group list-group-flush small">
        <li class="list-group-item d-flex justify-content-between">Atomic Mass: <span>${el.AtomicMass} u</span></li>
        <li class="list-group-item d-flex justify-content-between">Electron Configuration: <span>${el.ElectronConfiguration}</span></li>
        <li class="list-group-item d-flex justify-content-between">Oxidation States: <span>${el.OxidationStates}</span></li>
        <li class="list-group-item d-flex justify-content-between">Year Discovered: <span>${el.YearDiscovered}</span></li>
    </ul>`;
  }
  elementCard(el) {
      var elLabelSmall = this.elementLabel( el );
      var elInfoSmall = this.elementInfoSmall( el );
      return `<div class="d-flex flex-row justify-content-evenly align-items-center mx-auto">
          <div class="p-lg-4 p-md-3 p-sm-2">${elLabelSmall}</div>
          <div class="d-none d-lg-block flex-fill pe-md-4 pe-sm-2 small">${elInfoSmall}</div>
        </div>`;
  }
  table(){
    var html = `<table class="pt-elements-table">`;
    var lant = []; 
    var act = [];
    for(var i in this.elements.Table.Row){
        var el = this.elements.Table.Row[i].Cell;
        el = this.element( el );
        if(["0","2","10","18","36","54","86"].indexOf(i) > -1)
            html += `<tr>`;

        var color = this.propertyColor(el);
        var td = `<td class="border" style="background:${color};" data-bs-toggle="modal" data-bs-target="#pt-aa-elements" data-atomicnumber="${el.AtomicNumber}" data-groupblock="${this.propertyLabel(el)}">${ this.elementLabelSM( el )}</td>`;
        if( (i < 56 || i > 70) && (i < 88 || i > 102) )
            html += td;
        
        if( (i > 55 && i < 71) )
            lant.push(td);
        
        if( (i > 87 && i < 103) )
            act.push(td);
    
        if( i == "56")
            html += `<td class="text-center pt-elements-f-1vw">*</td>`;
    
        if( i == "88" )
            html += `<td class="text-center pt-elements-f-1vw">**</td>`;
    
        if(i == "0"){
            html += `<td></td>`;
            html += `<td colspan="10" rowspan="3" id="pt-elements-card"></td>`;
            html += `<td colspan="5" id="pt-elements-label-selector"></td>`;
        }
    
        if(["1","9","17","35","53","85","117"].indexOf(i) > -1)
            html += `</tr>`;
    }
    html += `<tr>`;
    html += `<td colspan="18" class="pt-2 pb-3"></td>`;
    html += `<tr>`;
    html += `<td colspan="2"></td>`;
    html += `<td class="text-center pt-elements-f-1vw">*</td>`;
    html += lant.join("");
    html += `</tr>`;
    html += `<tr>`;
    html += `<td colspan="2"></td>`;
    html += `<td class="text-center pt-elements-f-1vw">**</td>`;
    html += act.join("");
    html += `</tr>`;
    html += `</table>`;

    html += `<div class="modal fade" id="pt-aa-elements" tabindex="-1" aria-labelledby="pt-aa-elements-label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pt-aa-elements-label">Element Name</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>`;  

    return html;
  }
  updateView(){
    var cells = document.querySelectorAll('.pt-elements-table td[data-atomicnumber]');
    cells.forEach( cell => {
      var el = cell.getAttribute('data-atomicnumber');
      el = this.element(this.elements.Table.Row[parseInt(el)-1].Cell);
      cell.setAttribute('data-groupblock', this.propertyLabel(el))
      cell.style.background = this.propertyColor(el) || "none";
      if(this.selectedProperty == 'AtomicRadius' || this.selectedProperty == 'OxidationStates')
        cell.style.color = '#000000';
      else
        cell.style.color = this.getContrastColor(this.propertyColor(el))
    });

    var el = document.querySelector("#pt-elements-card .card-element").getAttribute('data-atomicnumber');
    el = this.element(this.elements.Table.Row[parseInt(el)-1].Cell);
    document.querySelector("#pt-elements-card .card-element").style.background = this.propertyColor(el) || "none";
    document.querySelector("#pt-elements-card .card-element").style.color = this.getContrastColor(this.propertyColor(el));
  }
  init() {
    document.querySelector(this.selector).innerHTML = this.table();
    var modal = document.getElementById('pt-aa-elements');
    var _this = this;

    var elno = Math.ceil(this.elements.Table.Row.length * Math.random());
    var el = this.element(this.elements.Table.Row[elno].Cell);

    document.querySelector("#pt-elements-card").innerHTML = this.elementCard(el);
    document.querySelector("#pt-elements-card .card-element").style.backgroundColor = _this.propertyColor(el) || "none";
    document.querySelector("#pt-elements-card .card-element").style.color = '#212529'
    document.querySelectorAll(".pt-elements-table td[data-bs-target]").forEach( el => el.style.color = '#212529')

    var cells = document.querySelectorAll('.pt-elements-table td[data-atomicnumber]');
    cells.forEach(function(cell){
      cell.addEventListener('mouseover', function(){
        var el = this.getAttribute('data-atomicnumber');
        el = _this.element(_this.elements.Table.Row[parseInt(el)-1].Cell);
        document.querySelector("#pt-elements-card").innerHTML = _this.elementCard(el);
        document.querySelector("#pt-elements-card .card-element").style.background = this.style.background || _this.propertyColor(el) || "none";
        document.querySelector("#pt-elements-card .card-element").style.color = this.style.color
      });
    });

    var options = _this.propertyOptions.map(function(p){ return `<option value="${p}" ${p=="GroupBlock"? "selected" : ""}>${p.replace(/([a-z])([A-Z])/g, '$1 $2')}</option>` });
    document.querySelector("#pt-elements-label-selector").innerHTML =`<select class="form-select form-select-sm d-print-none" title="Select Property or Trend to display">${options}</select>`;

    document.querySelector("#pt-elements-label-selector").innerHTML += `<input type="range" title="Change Trend Color" class="form-range form-range-sm d-none d-md-block d-print-none mt-2" min="0" max="360" step="1" value="${_this.selectedColor}"></input>`;

    document.querySelector("#pt-elements-label-selector select").addEventListener('change', function(){
      _this.property = this.value;
      _this.updateView();
    });

    document.querySelector("#pt-elements-label-selector input").addEventListener('change', function(){
      _this.selectedColor = this.value;
      _this.updateView();
    });

    modal.addEventListener('show.bs.modal', function (event) {

      var button = event.relatedTarget;
      var element = button.getAttribute('data-atomicnumber');

      var idx = _this.elements.Table.Row.findIndex(function(x){
          return x.Cell[0] == element;
      });

      var el = _this.element(_this.elements.Table.Row[idx].Cell);

      var header = document.querySelector('#pt-aa-elements .modal-header');
      header.style.background = button.style.background || "none";
      header.style.color = button.style.color || 'inherit'

      var title = document.querySelector('#pt-aa-elements .modal-title');
      title.innerHTML = _this.selectedProperty == 'GroupBlock'? `${el.Name} <small> - ${_this.propertyLabel(el)}</small>`: el.Name;

      var body = document.querySelector('#pt-aa-elements .modal-body');
      body.innerHTML = `${_this.elementLink( el )}${_this.elementLabel( el )}${_this.elementInfo( el )} `;
    });
  }
}
