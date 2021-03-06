var setName = ""

function list_init(){
  var url = window.location.search;
  var setID = 0;
  if (url.indexOf("?") != -1) {
    setID = window.location.search.split("=")[1];
  }
  setName = "dataSet" + setID;
}

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
  var data = JSON.parse(localStorage.getItem(setName));
  console.log(data);
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

list_init();

tableRender();