const options = ["zero", "one", "two"];
tbodyObj = tblObj.firstElementChild

function Item() {

};

init();

function getSelectList(s, count) {
  var select = document.createElement("select");
  select.id = "select-" + count;
  select.className = "custom-select range-select";
  var defaultOpt = document.createElement("option");
  defaultOpt.selected = "selected";
  defaultOpt.innerHTML = "Select item";
  select.appendChild(defaultOpt);
  for (var i = 0; i < options.length; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = options[i];
    select.appendChild(opt);
  }
  s.appendChild(select);
}

function getRangeInputs(range, count) {
  var inputObj = document.createElement("input");
  inputObj.type = "text";
  inputObj.className = "range-input select-range-min";
  inputObj.id = "range-min-" + count;
  range.appendChild(inputObj);
  range.innerHTML += " - ";
  inputObj.className = "range-input select-range-max";
  inputObj.id = "range-max-" + count;
  range.appendChild(inputObj);
}

function countAllConditions(tbody) {
  var trArr = tbody.children;
  var count = 0;
  for (var i = 0; i < trArr.length; i++) {
    var tr = trArr[i];
    count += tr.children.length;
  }
  return count;
}

function addCondition() {
  var count = countAllConditions(tbodyObj) / 2;
  var selectTd = document.createElement("td");
  getSelectList(selectTd, count);
  var rangeTd = document.createElement("td");
  getRangeInputs(rangeTd, count);

  if (count % 2 == 0) {
    var tr = document.createElement("tr");
    tr.appendChild(selectTd);
    tr.appendChild(rangeTd);
    tbodyObj.appendChild(tr);
  } else {
    var lastTr = tbodyObj.lastElementChild;
    lastTr.appendChild(selectTd);
    lastTr.appendChild(rangeTd);
  }
}

function groupConditions() {
  var minObj = new Item();
  var maxObj = new Item();
  var trArr = tbodyObj.children;
  for (var i = 0; i < trArr.length; i++) {
    var tdArr = trArr[i].children;
    j = 0;
    for (var j = 0; j < tdArr.length; j += 2) {
      var selectTd = tdArr[j];
      var rangeTd = tdArr[j + 1];
      var select = selectTd.firstElementChild;
      if (isNaN(select.value)) continue;
      var inputMin = rangeTd.firstElementChild;
      var inputMax = rangeTd.lastElementChild;
      var attr = options[select.value];
      if (inputMin.value == '') {
        minObj[attr] = null;
      } else {
        minObj[attr] = inputMin.value;
      }
      if (inputMax.value == '') {
        maxObj[attr] = null;
      } else {
        maxObj[attr] = inputMax.value;
      }
    }
  }
  var res = {
    min: minObj,
    max: maxObj
  }
  console.log(res);
}

function resetTable() {
  tbodyObj.innerHTML = "";
  addCondition();
  addCondition();
}

function init() {
  addBtn.onclick = addCondition;
  addCondition();
  addCondition();
  submitBtn.onclick = groupConditions;
  resetBtn.onclick = resetTable;
}


