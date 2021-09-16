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
        "Nonmetal": "rgba(255, 255, 0, 0.3)",
        "Noble gas": "rgba(255, 152, 0, 0.3)",
        "Alkali metal": "rgba(255, 0, 0, 0.25)",
        "Alkaline earth metal": "rgba(64, 64, 255, 0.25)",
        "Metalloid": "rgba(140, 190, 0, 0.3)",
        "Halogen": "rgba(255, 255, 0, 0.3)",
        "Post-transition metal": "rgba(0, 255, 0, 0.3)",
        "Transition metal": "rgba(0, 128, 255, 0.3)",
        "Lanthanide": "rgba(0, 255, 255, 0.35)",
        "Actinide": "rgba(64, 255, 192, 0.35)"
    };
    this.StandardState = {
      "Solid": "rgba(239, 239, 239, 1)",
      "Liquid": "rgba(254,191,196,1)",
      "Gas": "rgba(	193, 255, 254, 1)",
      "Expected to be a Solid": "rgba(255, 255, 255, 0.3)",
      "Expected to be a Gas": "rgba(193, 255, 254, 0.3)",
      "Expected to be a Liquid": "rgba(254, 191, 196, 0.3)"
  };
    this.properties = [
      "AtomicMass",
      "CPKHexColor",
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
      return el.CPKHexColor;
    else if(this.selectedProperty == "GroupBlock")
      return this.GroupBlock[el.GroupBlock];
    else if(this.selectedProperty == "StandardState")
      return this.StandardState[el.StandardState];
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

      if(el[this.selectedProperty] == "" || Number.isNaN(Number(el[this.selectedProperty])))
        return `#FFFFFF`;
      let r = ( (Number(el[this.selectedProperty])  - range[0]) / (range[1] - range[0]) );
      if(this.property == "AtomicRadius")
        return `radial-gradient(circle, hsl(${this.selectedColor},100%,50%), white ${parseInt( r * 100 )}%, white ${parseInt( r * 100 )}%)`;
      if(this.property == "AtomicMass")
        return `hsl(${this.selectedColor}, 100%, ${parseInt( 100 - r * 75 )}%)`;
      else
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
  element(el){
    return {
        "AtomicNumber": (el[0] || ""),
        "Symbol": (el[1] || ""),
        "Name": (el[2] || ""),
        "AtomicMass": (el[3] || ""),
        "CPKHexColor": (`#${el[4]}` || ""),
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
    return `<div class="mx-auto card-element ratio mt-md-n5" style="--bs-aspect-ratio: 100%;max-width: 8.5rem;width: 4rem;">
        <div class="border d-flex flex-column justify-content-center p-sm-1 text-center">
        <span>${el.AtomicNumber}</span>
        <span class="fs-1">${el.Symbol}</span>
        <small class="d-none d-md-block">${el.Name}</small>
        <small class="d-none d-md-block" style="font-size:0.8vw;">${this.propertyLabel(el)}</small>
      </div>
     </div>`;
  }
  elementLabelSM(el){
    return `<div class="ratio" style="--bs-aspect-ratio: 120%; overflow:hidden; cursor:pointer;">
      <div class="d-flex flex-column justify-content-center">
        <span class="d-none d-sm-block" style="font-size:1vw;">${el.AtomicNumber}</span>
        <span class="d-block text-center" style="font-size:2vw;">${el.Symbol}</span>
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
    return `<a href="https://pubchem.ncbi.nlm.nih.gov/element/${el.AtomicNumber}" target="_blank" style="position: absolute; right: 1.5rem;" title="More about ${el.Name} on PubChem">
        <i class="bi-info-circle"></i>
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
          <div class="p-md-4 p-sm-2">${elLabelSmall}</div>
          <div class="d-none d-md-block flex-fill pe-md-4 pe-sm-2 small">${elInfoSmall}</div>
        </div>`;
  }
  table(){
    var html = `<table id="plugin-periodic-table" style="user-select: none; width: 100%; table-layout: fixed; border-spacing: 2px; border-collapse: separate;">`;
    var lant = []; 
    var act = [];
    for(var i in this.elements.Table.Row){
        var el = this.elements.Table.Row[i].Cell;
        el = this.element( el );
        if(["0","2","10","18","36","54","86"].indexOf(i) > -1)
            html += `<tr>`;

        var color = this.propertyColor(el);
        var td = `<td class="border" style="background:${color};" data-bs-toggle="modal" data-bs-target="#modal" data-atomicnumber="${el.AtomicNumber}" data-groupblock="${this.propertyLabel(el)}">${ this.elementLabelSM( el )}</td>`;
        if( (i < 56 || i > 70) && (i < 88 || i > 102) )
            html += td;
        
        if( (i > 55 && i < 71) )
            lant.push(td);
        
        if( (i > 87 && i < 103) )
            act.push(td);
    
        if( i == "56")
            html += `<td class="text-center" style="font-size:1vw;">*</td>`;
    
        if( i == "88" )
            html += `<td class="text-center" style="font-size:1vw;">**</td>`;
    
        if(i == "0"){
            html += `<td></td>`;
            html += `<td colspan="10" rowspan="3" id="plugin-element-card"></td>`;
            html += `<td colspan="5" id="plugin-label-selector"></td>`;
        }
    
        if(["1","9","17","35","53","85","117"].indexOf(i) > -1)
            html += `</tr>`;
    }
    html += `<tr>`;
    html += `<td colspan="18" style="height:20px;"></td>`;
    html += `<tr>`;
    html += `<td colspan="2"></td>`;
    html += `<td class="text-center" style="font-size:1vw;">*</td>`;
    html += lant.join("");
    html += `</tr>`;
    html += `<tr>`;
    html += `<td colspan="2"></td>`;
    html += `<td class="text-center" style="font-size:1vw;">**</td>`;
    html += act.join("");
    html += `</tr>`;
    html += `</table>`;

    html += `<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>`;  

    return html;
  }
  init() {
    if ( !document.querySelector('style') ){
      let style = document.createElement('style');
      document.head.appendChild(style);
    }
    document.querySelector('style').textContent += "@media (min-width:576px) { .card-element { width: 4.5rem!important; }}";
    document.querySelector('style').textContent += "@media (min-width:768px) { .card-element { width: 8.5rem!important; }}";

    document.querySelector('style').textContent += "@media (max-width:575.98px) {#plugin-label-selector select {min-height: auto; font-size: 9px; padding: 2px;}}";
    document.querySelector('style').textContent += "@media (max-width:767.98px) {#plugin-label-selector select {min-height: auto; padding: 2px;}}";

    document.querySelector(this.selector).innerHTML = this.table();
    var modal = document.getElementById('modal');
    var _this = this;

    var elno = Math.ceil(this.elements.Table.Row.length * Math.random());
    var el = this.element(this.elements.Table.Row[elno].Cell);

    document.querySelector("#plugin-element-card").innerHTML = this.elementCard(el);
    document.querySelector("#plugin-element-card .card-element").style.backgroundColor = _this.propertyColor(el) || "none";

    var cells = document.querySelectorAll('#plugin-periodic-table td[data-atomicnumber]');
    cells.forEach(function(cell){
      cell.addEventListener('mouseover', function(){
        var el = this.getAttribute('data-atomicnumber');
        el = _this.element(_this.elements.Table.Row[parseInt(el)-1].Cell);
        document.querySelector("#plugin-element-card").innerHTML = _this.elementCard(el);
        document.querySelector("#plugin-element-card .card-element").style.backgroundColor = _this.propertyColor(el) || "none";
        
      });
    });

    var options = _this.propertyOptions.map(function(p){ return `<option value="${p}" ${p=="GroupBlock"? "selected" : ""}>${p.replace(/([a-z])([A-Z])/g, '$1 $2')}</option>` });
    document.querySelector("#plugin-label-selector").innerHTML =`<select class="form-control form-control-sm d-print-none">${options}</select>`;

    document.querySelector("#plugin-label-selector").innerHTML += `<input type="range" class="form-range form-range-sm d-none d-md-block d-print-none" min="0" max="360" step="1" value="${_this.selectedColor}"></input>`;

    document.querySelector("#plugin-label-selector select").addEventListener('change', function(){
      _this.property = this.value;
      
      var cells = document.querySelectorAll('#plugin-periodic-table td[data-atomicnumber]');
      cells.forEach(function(cell){
        var el = cell.getAttribute('data-atomicnumber');
        el = _this.element(_this.elements.Table.Row[parseInt(el)-1].Cell);
        cell.setAttribute('data-groupblock', _this.propertyLabel(el))
        cell.style.background = _this.propertyColor(el) || "none";
      });
      
    });

    document.querySelector("#plugin-label-selector input").addEventListener('change', function(){
      _this.selectedColor = this.value;
      
      var cells = document.querySelectorAll('#plugin-periodic-table td[data-atomicnumber]');
      cells.forEach(function(cell){
        var el = cell.getAttribute('data-atomicnumber');
        el = _this.element(_this.elements.Table.Row[parseInt(el)-1].Cell);
        cell.setAttribute('data-groupblock', _this.propertyLabel(el))
        cell.style.background = _this.propertyColor(el) || "none";
      });
      
    });

    modal.addEventListener('show.bs.modal', function (event) {

      var button = event.relatedTarget;
      var el = button.getAttribute('data-atomicnumber');

      var idx = _this.elements.Table.Row.findIndex(function(x){
          return x.Cell[0] == el;
      });

      el = _this.element(_this.elements.Table.Row[idx].Cell);

      var header = document.querySelector('#modal .modal-header');
      header.style.background = _this.propertyColor(el) || "none";

      var title = document.querySelector('#modal .modal-title');
      title.innerHTML = `${el.Name} <small class="text-muted">${_this.propertyLabel(el)}</small>`;

      var body = document.querySelector('#modal .modal-body');
      body.innerHTML = `${_this.elementLink( el )}${_this.elementLabel( el )}${_this.elementInfo( el )} `;
    });
  }
}
