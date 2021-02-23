function renderTitleList(theadTr, list, has_count) {
  if (has_count) {
    theadTr.innerHTML = '<th scope="col">#</th>';
  }
  for (var i in list) {
    var th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = list[i];
    theadTr.appendChild(th);
  }
}

function renderData(tbody, has_count) {
  console.log(localStorage.dataSet);
  var data = JSON.parse(localStorage.dataSet);
  for (var i in data) {
    var tr = document.createElement("tr");
    if (has_count) {
      tr.innerHTML = '<th scope="row">' + (parseInt(i) + 1) + '</th>';
    }
    for (var j in data[i]) {
      var td = document.createElement("td");
      td.innerHTML = data[i][j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

var tableRender = function() {
  var tableTitleList = ["fr", "en", "success", "fail"];
  var theadTr = document.getElementsByClassName("thead")[0].firstElementChild;
  renderTitleList(theadTr, tableTitleList, true);
  var tbody = document.getElementsByClassName("tbody")[0];
  renderData(tbody, true);
};

tableRender();