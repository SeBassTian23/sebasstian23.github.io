/**
 * Chlorophyll content calculator
 */

function SampleInput(sample,repeat){
  var html = `<div class="col-md-6 mb-3" data-sample="${sample}">`
    html += `<div class="input-group mb-3">`;
      html += `<span class="input-group-text">Sample</span>`
      html += `<input type="text" class="form-control" placeholder="Sample #${sample+1}" name="sample[]">`;
    html += `</div>`;

    html += `<table class="table table-sm" data-table="${sample}">`;
    html += `<thead class="thead-dark"><tr><th>#</th><th>646 nm</th><th>663 nm</th><th>750 nm</th><th>Dilution</th></tr></thead>`;
    html += `<tbody>`;
    for(j = 0; j < repeat; j++){
        html += `<tr>`;
        html += `<td><b>${(j+1)}</b></td>`;
        html += `<td><input type="text" maxlength="7" class="form-control form-control-sm" value="" name="NM646[${sample}][]"></td>`;
        html += `<td><input type="text" maxlength="7" class="form-control form-control-sm" value="" name="NM663[${sample}][]" ></td>`;
        html += `<td><input type="text" maxlength="7" class="form-control form-control-sm" value="" name="NM750[${sample}][]" ></td>`;
        html += `<td><input type="text" maxlength="7" class="form-control form-control-sm" value="" name="dilution[${sample}][]" ></td>`;
        html += `</tr>`;
    }
    html += `</tbody>`;
    html += `<tfoot><tr><td colspan="4"><i class="bi-plus-square text-dark add-row" data-table="${sample}"></i> <i class="bi-dash-square text-dark remove-row" data-table="${sample}"></i><td></tr></tfoot>`;
    html += `</table>`;
  html += `</div>`;
  return html;
}

function MathMean(values){
  var mean = false;
	var count = 0;
	if (values && Array.isArray(values)) {
		for (var i = 0, len = values.length; i < len; i++){
			if(values[i] === null)
				continue;
			else if(!Number(values[i]) && values[i] !== null && values[i] != 0)
				return parseFloat(!Number(values[i]));
			else{
				mean += Number(values[i]);
				count++;
			}
		}
		mean /= count;
	}
	return parseFloat(mean);
}

function CalculateContent(selector){
  var output = [];
  var samples = document.querySelectorAll(`${selector} input[name="sample[]"]`);
  samples.forEach(function(el,idx){
    var sample = el.value;
    
    var mean646 = [];
    var mean663 = [];
    var mean750 = [];
    var ca = [];
    var cb = [];

    var NM646 = [];
    var NM663 = [];
    var NM750 = [];
    var dilution = [];

    document.querySelectorAll(`${selector} input[name="NM646[${idx}][]"]`).forEach(function(el){
      NM646.push(parseFloat(el.value));
    });
    
    document.querySelectorAll(`${selector} input[name="NM663[${idx}][]"]`).forEach(function(el){
      NM663.push(parseFloat(el.value));
    });
    
    document.querySelectorAll(`${selector} input[name="NM750[${idx}][]"]`).forEach(function(el){
      NM750.push(parseFloat(el.value));
    });
    
    document.querySelectorAll(`${selector} input[name="dilution[${idx}][]"]`).forEach(function(el){
      dilution.push(parseFloat(el.value));
    });

    for(var i in NM646){
        ca.push( ((0.01225*(NM663[i]-NM750[i]))-(0.00255*(NM646[i]-NM750[i]))) * dilution[i] );
        cb.push( ((0.02031*(NM646[i]-NM750[i]))-(0.00491*(NM663[i]-NM750[i]))) * dilution[i] );
    }

    ca = MathMean(ca);
    cb = MathMean(cb);

    var chlContent = ca + cb;	// Chlorophyll amount
    var chlabRatio = ca / cb;	// Chlorophyll a/b ratio

    output.push([
      sample,
      // Math.round(mean646*1000)/1000,
      // Math.round(mean663*1000)/1000,
      // Math.round(mean750*1000)/1000,
      Math.round(ca*1000)/1000,
      Math.round(cb*1000)/1000,
      Math.round(chlContent*1000)/1000,
      Math.round(chlabRatio*1000)/1000
    ]);
  });
  return output;
}

function ShowResults(selector, results = []){
  var container = document.querySelector(selector);
  var html = "<h2 class=\"mb-4\">Results</h2>";
  html += "<table class=\"table table-striped table-sm\" id=\"resultTable\">";
    html += "<thead>";
      html += "<tr>";
        html += "<th>Sample</th>";
        // html += "<th>646 nm</th>";
        // html += "<th>663 nm</th>";
        // html += "<th>750 nm</th>";
        html += "<th>Chl. a+b [μg]</th>";
        html += "<th>Chl a/b ratio</th>";
        html += "<th>Chl. a [μg]</th>";
        html += "<th>Chl. b [μg]</th>";
      html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    for(var i in results){
        html += "<tr>";
        for(var row  in results[i]){
          html += `<td>${results[i][row]}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody>";
  html += "</table>"; 
  container.innerHTML = html;
};

function addRow(tableID){
// Get a reference to the table
var tableRef = document.getElementById(tableID);

// Get rows in table and iterate
var tableLength = tableRef.rows.length;

// Insert a row
var newRow   = tableRef.insertRow(tableLength);

// Insert first cell with index
var newCell1  = newRow.insertCell(0);
// Insert cell for 646 nm
var newCell2  = newRow.insertCell(1);
// Insert cell for 663 nm
var newCell3  = newRow.insertCell(2);
// Insert cell for 750 nm
var newCell4  = newRow.insertCell(3);

// Append a text node to the indexcell
var element = document.createElement("b");
element.innerHTML = tableLength;
newCell1.appendChild(element);

// Append input node to the 646 nm
var el = document.createElement('input');
el.type = 'text';
el.name = 'NM646[' + (tableID-1) + '][' + (tableLength - 1) +']';
el.size = 5;
el.className  = 'span1';
newCell2.appendChild(el);

// Append input node to the 663 nm
var el = document.createElement('input');
el.type = 'text';
el.name = 'NM663[' + (tableID-1) + '][' +(tableLength - 1) +']';
el.size = 5;
el.className  = 'span1';
newCell3.appendChild(el);

// Append input node to the 750 nm
var el = document.createElement('input');
el.type = 'text';
el.name = 'NM750[' + (tableID-1) + '][' +(tableLength - 1) +']';
el.size = 5;
el.className  = 'span1';
newCell4.appendChild(el);
}

function removeRow(tableID){
  var tbl = document.getElementById(tableID);
  var lastRow = tbl.rows.length;
  if (lastRow > 2){
    tbl.deleteRow(lastRow - 1);
  }
}

//   $('#content').on('click','.add-row',function(){
//       var row = $(this).closest('table').find('tbody tr:last');
//       var clone = row.clone();
//       row.after(clone);
//       var len = $(this).closest('table').find('tbody tr').length;
//       $(this).closest('table').find('tbody tr:last td:first b').text(len);
//   });

//   $('#content').on('click','.remove-row',function(){
//       var row = $(this).closest('table').find('tbody tr:last');
//       row.remove();
//   });

//   $('#content').on('click','#plugin-add-sample',function(){
//       var len = $('#plugin-data-input table:last tbody tr').length;
//       var input = SampleInput(len);
//       $('#plugin-data-input').append(input);
//   });

class ChloropyllCalculator{
  constructor(selector) {
    this.selector = selector;
  }
  sampleForm(){

  }
  addRow(){

  }
  removeRow(){

  }
  calculate(){

  }
  init(){

  }
}