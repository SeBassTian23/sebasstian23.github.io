/**
 * Periodic Table plugin for the Knowledge Base
 * 
 * https://www.chem.ucalgary.ca/courses/351/Carey5th/Ch27/ch27-1-4-2.html
 * https://wou.edu/chemistry/courses/online-chemistry-textbooks/ch450-and-ch451-biochemistry-defining-life-at-the-molecular-level/chapter-2-protein-structure/
 */

 class PeriodicTableAA {
  constructor(selector,source) {
    this.selector = selector;
    this.colors = {
      "Basic": "rgba(84,192,226,1)",
      "Non-polar (hydrophobic)": "rgba(187, 227, 238, 1)",
      "Polar, uncharged": "rgba(245, 210, 220, 1)",
      "Acidic": "rgba(214, 27, 125, 1)"
    };
    this.aa = source;
  }
  formula(str = ""){
    var regex = /([A-Z][a-z]?)(\d*(?:(?:[\.|\,])\d+(?:\%)?)?)|(?:[\(|\[])([^()]*(?:(?:[\(|\[]).*(?:[\)|\]]))?[^()]*)(?:[\)|\]])(\d*(?:(?:[\.|\,]?)\d+(?:\%)?))/g;
    return (str.match(regex) || []).map(e => e.replace(regex, '$1<sub>$2</sub>').replace('<sub></sub>','')).join("") || str;
  }
  element(el){
    return {
        "SingleLetterCode": (el[0] || ""),
        "ThreeLetterCode": (el[1] || ""),
        "Name": (el[2] || ""),
        "MolecularFormula": (this.formula(el[3]) || el[3]),
        "RelativeMolecularMass": (el[4] || ""),
        "Mz-H2O": (el[5] || ""),
        "pI": (el[6] || ""),
        "pK1": (el[7] || ""),
        "pK2": (el[8] || ""),
        "pK3": (el[9] || ""),
        "GroupBlock": (el[10] || ""),
        "ChemicalStructure": (el[11] || "")
    };
  }
  elementLabel(el) {
    return `<img src="${el.ChemicalStructure}" class="mx-auto d-block mb-3 pt-aa-table-dialog-img">`;
  }
  elementInfo(el) {
    return `<ul class="list-group list-group-flush small">
      <li class="list-group-item d-flex justify-content-between">One Letter Code: <span>${el.SingleLetterCode}</span></li>
      <li class="list-group-item d-flex justify-content-between">Three Letter Code: <span>${el.ThreeLetterCode}</span></li>
      <li class="list-group-item d-flex justify-content-between">Relative Molecular Mass: <span>${el.RelativeMolecularMass} Da</span></li>
      <li class="list-group-item d-flex justify-content-between">Mz-H₂O: <span>${el["Mz-H2O"]}</span></li>
      <li class="list-group-item d-flex justify-content-between">Molecular Formula: <span>${el.MolecularFormula}</span></li>
      <li class="list-group-item d-flex justify-content-between">Isoelectric Point: <span>${el.pI}</span></li>
      <li class="list-group-item d-flex justify-content-between">pK1 (α-COOH): <span>${el.pK1}</span></li>
      <li class="list-group-item d-flex justify-content-between">pK2 (α-⁺NH₃): <span>${el.pK2}</span></li>
      <li class="list-group-item d-flex justify-content-between">pK3 (α-Residue): <span>${el.pK3}</span></li>
    </ul>`;
  }
  elementLabelSM(el){
    return `<div class="ratio pt-aa-table-card">
      <div class="d-flex flex-row-reverse flex-wrap justify-content-between p-1 pt-0">
        <span class="fw-bolder fs-3">${el.ThreeLetterCode}</span>  
        <span class="d-none d-lg-block pt-2 pt-aa-table-card-values"><strong>${el.SingleLetterCode}</strong><br>${el.RelativeMolecularMass}<br>${el["Mz-H2O"]}<br>${el.MolecularFormula}</span>
        <div class="d-none d-lg-block pt-aa-table-card-img" style="background-image:url('${el.ChemicalStructure}');"></div>
        <span lang="en" class="fw-bold d-none d-md-block pt-aa-table-card-name">${el.Name}</span>
      </div>
    </div>`;
  }
  table(){
    var html = `<table class="pt-aa-table">`;
    for(var i in this.aa.Table.Row){
        var el = this.aa.Table.Row[i].Cell;
        if(["0","2","9","16"].indexOf(i) > -1)
            html += `<tr>`;
            
        el = this.element(el);
        html += `<td style="background-color:${this.colors[el.GroupBlock]};" data-bs-toggle="modal" data-bs-target="#pt-aa-modal" data-aa="${el.SingleLetterCode}" data-groupblock="${el.GroupBlock}">${this.elementLabelSM(el)}</td>`;
        if(i == "0"){
          var img = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iMjUwIj48cGF0aCBkPSJNMTQ1LjY2MiAxMC41aDIwMHYyMzBoLTIwMHYtMjMweiIgc3Ryb2tlPSIjNkE2QTZBIiBmaWxsPSJub25lIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEwLjIyNyAzNy4zNDUpIj4KICAgICAgPHRzcGFuIHg9Ii0yOC4wMTEiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwtQm9sZE1UIiBmb250LXNpemU9IjM2Ij5IaXM8L3RzcGFuPgogICAgPC90ZXh0Pjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDI5My45IDIxOS44NDUpIj4KICAgICAgPHRzcGFuIHg9Ii00NC4zMzgiIHk9IjYuNSIgZm9udC1mYW1pbHk9IkFyaWFsLUJvbGRNVCIgZm9udC1zaXplPSIyMSI+SGlzdGlkaW5lPC90c3Bhbj4KICAgIDwvdGV4dD48cGF0aCBkPSJNMjM3LjQwOSAxNDQuNTAydi0xLjE0NGwyMC4xNjcgMTEuNjA4di41ODZsLS41MjguMjY0LTE5LjYzOS0xMS4zMTR6bTIwLjY5NCAxMS4zMTQtLjUyNy0uMjY0di0uNTg2bDIwLjEzNy0xMS42MDh2MS4xNDRsLTE5LjYxIDExLjMxNHptMzQuOTQ0LjM3MmMwLTEuNjcyLjQ0OS0yLjk4IDEuMzQ3LTMuOTI2Ljg5OC0uOTQ2IDIuMDU3LTEuNDIgMy40NzgtMS40Mi45MyAwIDEuNzY4LjIyMyAyLjUxNS42NjdhNC4zNDUgNC4zNDUgMCAwIDEgMS43MDggMS44NTljLjM5Mi43OTQuNTg4IDEuNjk2LjU4OCAyLjcwNCAwIDEuMDIxLS4yMDYgMS45MzUtLjYxOSAyLjc0MS0uNDEyLjgwNy0uOTk2IDEuNDE3LTEuNzUyIDEuODMyYTUuMDExIDUuMDExIDAgMCAxLTIuNDQ3LjYyMmMtLjk0OSAwLTEuNzk2LS4yMjktMi41NDMtLjY4N2E0LjQyMyA0LjQyMyAwIDAgMS0xLjY5OC0xLjg3NiA1LjY4MSA1LjY4MSAwIDAgMS0uNTc3LTIuNTE2em0xLjM3My4wMTdjMCAxLjIxNC4zMjcgMi4xNy45OCAyLjg2OS42NTIuNjk4IDEuNDczIDEuMDQ3IDIuNDU3IDEuMDQ3IDEuMDA0IDAgMS44MjktLjM1MiAyLjQ3OS0xLjA1OC42NDgtLjcwNS45NzItMS43MDYuOTcyLTMuMDAyIDAtLjgxOS0uMTM4LTEuNTM1LS40MTYtMi4xNDdhMy4xODUgMy4xODUgMCAwIDAtMS4yMTctMS40MjIgMy4zMDMgMy4zMDMgMCAwIDAtMS43OTctLjUwNWMtLjk0NCAwLTEuNzU2LjMyNS0yLjQzNy45NzMtLjY4LjY0OC0xLjAyMSAxLjczLTEuMDIxIDMuMjQ1em0xMC4wMjggNC44ODd2LTEwLjA3NmgxLjMzN3Y0LjE0MWg1LjIxM3YtNC4xNDFoMS4zMzd2MTAuMDc3aC0xLjMzN3YtNC43NDZoLTUuMjEzdjQuNzQ2aC0xLjMzN3YtLjAwMXptLTI2LjczNS0xNi41OXYtMS4xNDRsMTUuMDk1IDguNzA2LS40OTguODgtMTQuNTk3LTguNDQyem0tNC44MzMtMjMuMTk0YzAtMS42NzMuNDUtMi45ODEgMS4zNDctMy45MjcuODk4LS45NDYgMi4wNTctMS40MTkgMy40NzgtMS40MTkuOTMgMCAxLjc2OS4yMjIgMi41MTYuNjY2YTQuMzY5IDQuMzY5IDAgMCAxIDEuNzA4IDEuODU5Yy4zOTIuNzk1LjU4OCAxLjY5Ny41ODggMi43MDQgMCAxLjAyMi0uMjA2IDEuOTM2LS42MTkgMi43NDItLjQxNC44MDYtLjk5NyAxLjQxNi0xLjc1MyAxLjgzMWE1LjAwNiA1LjAwNiAwIDAgMS0yLjQ0Ny42MjJjLS45NDkgMC0xLjc5NS0uMjI5LTIuNTQzLS42ODdhNC40MTYgNC40MTYgMCAwIDEtMS42OTctMS44NzYgNS42ODEgNS42ODEgMCAwIDEtLjU3OC0yLjUxNXptMS4zNzUuMDE3YzAgMS4yMTMuMzI2IDIuMTY5Ljk3OCAyLjg2OC42NTQuNjk5IDEuNDczIDEuMDQ4IDIuNDU4IDEuMDQ4IDEuMDAzIDAgMS44My0uMzUzIDIuNDc4LTEuMDU4LjY0OC0uNzA2Ljk3My0xLjcwNy45NzMtMy4wMDMgMC0uODE5LS4xMzgtMS41MzUtLjQxNS0yLjE0NmEzLjIwNiAzLjIwNiAwIDAgMC0xLjIxNy0xLjQyMyAzLjMwNyAzLjMwNyAwIDAgMC0xLjc5Ny0uNTA1Yy0uOTQ0IDAtMS43NTcuMzI1LTIuNDM4Ljk3My0uNjguNjQ4LTEuMDIgMS43My0xLjAyIDMuMjQ2eiIvPjxwYXRoIGQ9Ik0yNzUuNDU3IDEyNy43MDdoLjk5NnYxNy4yMzVoLS45OTd2LTE3LjIzNXptMy41MTcgMGguOTk2djE3LjIzNWgtLjk5N3YtMTcuMjM1em0tMjUuMzk4IDU2LjY1OVYxNzQuMjloMS4zNzJsNS4yNzkgNy45MDh2LTcuOTA4aDEuMjgzdjEwLjA3NmgtMS4zNzJsLTUuMjc4LTcuOTA4djcuOTA4aC0xLjI4M3ptMTAuMjI1IDBWMTc0LjI5aDEuMzM3djQuMTRoNS4yMTN2LTQuMTRoMS4zMzd2MTAuMDc2aC0xLjMzN3YtNC43NDVoLTUuMjEzdjQuNzQ1aC0xLjMzN3ptMTQuMjA3IDEuNzV2Ljg4OGgtNS4wMDFjLS4wMDctLjIyLjAzLS40MzkuMTEtLjY0NC4xMjctLjM0LjMzMS0uNjc1LjYxNC0xLjAwNS4yODEtLjMyOS42ODYtLjcwOSAxLjIxMy0xLjE0MS44MTgtLjY3NiAxLjM3My0xLjIxIDEuNjY1LTEuNjAyLjI5Mi0uMzkzLjQzOC0uNzY1LjQzOC0xLjExNmExLjIzOCAxLjIzOCAwIDAgMC0uMzk2LS45MjljLS4yNjQtLjI1Mi0uNjA4LS4zNzgtMS4wMzItLjM3OC0uNDQ5IDAtLjgwNy4xMzUtMS4wNzYuNDA0cy0uNDA1LjY0MS0uNDA5IDEuMTE3bC0uOTUzLS4xMDJjLjA2Ni0uNzEyLjMxMi0xLjI1NS43MzktMS42MjguNDI3LS4zNzQgMS0uNTYgMS43Mi0uNTYuNzI2IDAgMS4zMDEuMjAxIDEuNzI0LjYwMi40MjQuNDAzLjYzNi45MDEuNjM2IDEuNDk2IDAgLjMwMi0uMDYyLjU5OS0uMTg3Ljg5MS0uMTIzLjI5Mi0uMzMuNi0uNjE3LjkyMy0uMjg3LjMyMy0uNzY1Ljc2Ni0xLjQzIDEuMzMtLjU1Ny40NjctLjkxNi43ODMtMS4wNzUuOTUxLS4xNTkuMTY2LS4yOS4zMzMtLjM5NC41MDJoMy43MTF6bS0xOC4yMDQtMTMuMTgxaC00LjQ4NWwxLjcyOS0xNy4xMTkuNTI4LS4yNjQuNTI3LjI2NCAxLjcwMSAxNy4xMTh6bS00Mi4wNjItMTcuMDYtLjQ2OS0uMzIzLS4wMy0uNTU2IDIwLjE2Ni0xMS42Mzh2MS4xNDRsLTE5LjY2NyAxMS4zNzN6bS0yNS43Mi00LjI1di0xMC4wNzdoMS4zNzJsNS4yNzggNy45MDh2LTcuOTA4aDEuMjgzdjEwLjA3NmgtMS4zNzJsLTUuMjc5LTcuOTA3djcuOTA3aC0xLjI4M3ptLTE0LjAzNCAzNy40MzFWMTc4Ljk4aDEuMzM3djQuMTRoNS4yMTJ2LTQuMTRoMS4zMzh2MTAuMDc2aC0xLjMzOHYtNC43NDVoLTUuMjEydjQuNzQ1aC0xLjMzN3ptMTAuMDk2IDBWMTc4Ljk4aDEuMzcybDUuMjc5IDcuOTA3di03LjkwN2gxLjI4M3YxMC4wNzZoLTEuMzcybC01LjI3OS03LjkwOHY3LjkwOGgtMS4yODN6Ii8+PHBhdGggZD0ibTIwMS43MDggMTQ5LjE2My40MS0uOTA5IDE1LjEyNSA2Ljc0Mi4wMy41NTYtLjUyOC4zMjMtMTUuMDM3LTYuNzEzem0tMjAuNjM0IDE0LjI3NC0xLjIzMy0uMTE3IDEwLjQwNi0xMS41NDkuNzMzLjY3NC05LjkwNiAxMC45OTJ6bTQuMDQzLjczMy0uNzYyLS42NzQgOC40NzItOS40MS43MzMuNjc1LTguNDQyIDkuNDA5eiIvPjxwYXRoIGQ9Im0xODguODcgMTc2Ljk4LS44NS40OTgtOC4xNzktMTQuMTU4IDEuMjMyLjExNyA3Ljc5NyAxMy41NDN6bTI1LjUwMSAxLjI4OS45MzcuODQ5LTE3LjUyNyAzLjcyNC0uMjA2LS45OTcgMTYuNzk2LTMuNTc2eiIvPjxwYXRoIGQ9Im0yMTYuNzQ1IDE1NS44NzUuNTI4LS4zMjMuNDY5LjMyMy0yLjQzNCAyMy4yNDMtLjkzNy0uODQ5IDIuMzc0LTIyLjM5NHptLTMuNjkzIDEuNzg3Ljk2Ny4wODktMS45MDUgMTguMTE1LS45NjctLjExOCAxLjkwNS0xOC4wODZ6Ii8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU3LjQ0NyAzMC41NTQpIj4KICAgICAgPHRzcGFuIHg9Ii01LjA1NSIgeT0iNC41IiBmb250LWZhbWlseT0iQXJpYWwtQm9sZE1UIiBmb250LXNpemU9IjE0Ij5IPC90c3Bhbj4KICAgIDwvdGV4dD48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzIuODAyIDQ4Ljg0NSkiPgogICAgICA8dHNwYW4geD0iLTIxLjQxIiB5PSI0LjUiIGZvbnQtZmFtaWx5PSJBcmlhbE1UIiBmb250LXNpemU9IjE0Ij4xNTUuMTY8L3RzcGFuPgogICAgPC90ZXh0Pjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3Mi44MDIgNjguNDU0KSI+CiAgICAgIDx0c3BhbiB4PSItMjEuNDEiIHk9IjQuNSIgZm9udC1mYW1pbHk9IkFyaWFsTVQiIGZvbnQtc2l6ZT0iMTQiPjEzNy4xNDwvdHNwYW4+CiAgICA8L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkwLjM4MSA4Ny4zOTIpIj4KICAgICAgPHRzcGFuIHg9Ii0zNy45OSIgeT0iNC41IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCI+QzwvdHNwYW4+CiAgICAgIDx0c3BhbiB4PSItMjcuODc5IiB5PSI0LjUiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EiIGZvbnQtc2l6ZT0iMTIiPuKChjwvdHNwYW4+CiAgICAgIDx0c3BhbiB4PSItMjQuNTM5IiB5PSI0LjUiIGZvbnQtZmFtaWx5PSJBcmlhbE1UIiBmb250LXNpemU9IjE0Ij5IPC90c3Bhbj4KICAgICAgPHRzcGFuIHg9Ii0xNC40MjkiIHk9IjQuNSIgZm9udC1mYW1pbHk9IkhlbHZldGljYSIgZm9udC1zaXplPSIxMiI+4oKJPC90c3Bhbj4KICAgICAgPHRzcGFuIHg9Ii0xMS4wOTUiIHk9IjQuNSIgZm9udC1mYW1pbHk9IkFyaWFsTVQiIGZvbnQtc2l6ZT0iMTQiPk48L3RzcGFuPgogICAgICA8dHNwYW4geD0iLS45ODUiIHk9IjQuNSIgZm9udC1mYW1pbHk9IkhlbHZldGljYSIgZm9udC1zaXplPSIxMiI+4oKDPC90c3Bhbj4KICAgICAgPHRzcGFuIHg9IjIuMzQ5IiB5PSI0LjUiIGZvbnQtZmFtaWx5PSJBcmlhbE1UIiBmb250LXNpemU9IjE0Ij5PPC90c3Bhbj4KICAgICAgPHRzcGFuIHg9IjEzLjIzOSIgeT0iNC41IiBmb250LWZhbWlseT0iSGVsdmV0aWNhIiBmb250LXNpemU9IjEyIj7igoI8L3RzcGFuPgogICAgPC90ZXh0PjxwYXRoIGQ9Ik0zMzguNzM4IDM5LjU1NGgxOS4yMyIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDE4LjEyMiAzOC4zNDUpIj4KICAgICAgPHRzcGFuIHg9Ii01Ny4xMDMiIHk9IjQuODU1IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZBNkE2QSI+VGhyZWUgTGV0dGVyIENvZGU8L3RzcGFuPgogICAgPC90ZXh0PjxwYXRoIGQ9Ik0zMzguNzM4IDIyMC4zNDVoMTkuMjMiIHN0cm9rZT0iIzAwMCIgZmlsbD0ibm9uZSIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwMS41OTggMjE4LjQ0NikiPgogICAgICA8dHNwYW4geD0iLTQwLjU3OSIgeT0iNC41IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZBNkE2QSI+TmFtZTwvdHNwYW4+CiAgICA8L3RleHQ+PHBhdGggZD0iTTMyMC4yMjggMTUzLjAwOWgzNy43NCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDI0LjQxMyAxNTIuMzEyKSI+CiAgICAgIDx0c3BhbiB4PSItNjMuMzk0IiB5PSI0LjI5OCIgZm9udC1mYW1pbHk9IkFyaWFsTVQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QTZBNkEiPkNoZW1pY2FsIFN0cnVjdHVyZTwvdHNwYW4+CiAgICA8L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODQuMjUxIDQ4LjU0MykiPgogICAgICA8dHNwYW4geD0iLTQzLjAwNiIgeT0iNC41IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZBNkE2QSI+UmVsYXRpdmUgTWFzczwvdHNwYW4+CiAgICA8L3RleHQ+PHBhdGggZD0iTTEzMi42NjIgNDkuMzQ1aDE5LjIzIiBzdHJva2U9IiMwMDAiIGZpbGw9Im5vbmUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MC42NzcgMjkuMDQ5KSI+CiAgICAgIDx0c3BhbiB4PSItNTcuNDgiIHk9IjQuNzA0IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZBNkE2QSI+U2luZ2xlIExldHRlciBDb2RlPC90c3Bhbj4KICAgIDwvdGV4dD48cGF0aCBkPSJNMTMyLjY2MiAzMS4wNTRoMTkuMjMiIHN0cm9rZT0iIzAwMCIgZmlsbD0ibm9uZSIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDg0LjI1MSA2OS4xNTMpIj4KICAgICAgPHRzcGFuIHg9Ii0yLjQxMiIgeT0iNC41IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZBNkE2QSI+TTwvdHNwYW4+CiAgICAgIDx0c3BhbiB4PSI5LjI1MSIgeT0iNC41IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzZBNkE2QSI+WjwvdHNwYW4+CiAgICAgIDx0c3BhbiB4PSIxNS4zNTkiIHk9IjQuNSIgZm9udC1mYW1pbHk9IkFyaWFsTVQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QTZBNkEiPi1IPC90c3Bhbj4KICAgICAgPHRzcGFuIHg9IjMwLjEzMSIgeT0iNC41IiBmb250LWZhbWlseT0iSGVsdmV0aWNhIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkE2QTZBIj7igoI8L3RzcGFuPgogICAgICA8dHNwYW4geD0iMzQuMDIxIiB5PSI0LjUiIGZvbnQtZmFtaWx5PSJBcmlhbE1UIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkE2QTZBIj5PPC90c3Bhbj4KICAgIDwvdGV4dD48cGF0aCBkPSJNMTMyLjY2MiA2OC45NTRoMTkuMjMiIHN0cm9rZT0iIzAwMCIgZmlsbD0ibm9uZSIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDcwLjY3NyA4Ny4yNDEpIj4KICAgICAgPHRzcGFuIHg9Ii01Ny40MzkiIHk9IjQuMzQ5IiBmb250LWZhbWlseT0iQXJpYWxNVCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZBNkE2QSI+TW9sZWN1bGFyIEZvcm11bGE8L3RzcGFuPgogICAgPC90ZXh0PjxwYXRoIGQ9Ik0xMzIuNjYyIDg3Ljg5MmgxOS4yMyIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+PC9zdmc+`
          html += `<td colspan="5"><img alt="Legend for Amino Acid" class="d-none d-lg-block mx-auto pt-aa-table-legend-img" src="${img}"></td>`;
        }
        
        if(i == "20")
            html += `<td colspan="3"></td>`;
    
        if(["1","8","15","22"].indexOf(i) > -1)
            html += `</tr>`;
    }
    html += `</table>`;  

    html += `<div class="modal fade" id="pt-aa-modal" tabindex="-1" aria-labelledby="pt-aa-modal-label" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pt-aa-modal-label"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>`;  

    return html;
  }
  init() {
    document.querySelector(this.selector).innerHTML = this.table();
    var modal = document.getElementById('pt-aa-modal');
    var _this = this;
    modal.addEventListener('show.bs.modal', function (event) {

      var button = event.relatedTarget;
      var el = button.getAttribute('data-aa');

      var idx = _this.aa.Table.Row.findIndex(function(x){
          return x.Cell[0] == el;
      });

      el = _this.element(_this.aa.Table.Row[idx].Cell);

      var header = document.querySelector('#pt-aa-modal .modal-header');
      header.style.backgroundColor = _this.colors[el.GroupBlock] || "none";

      var title = document.querySelector('#pt-aa-modal .modal-title');
      title.innerHTML = `${el.Name} - <small>${el.GroupBlock}</small>`;

      var body = document.querySelector('#pt-aa-modal .modal-body');
      body.innerHTML = `${_this.elementLabel( el )} ${_this.elementInfo( el )}`;
    });
  }
}
