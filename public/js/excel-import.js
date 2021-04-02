var importForm = document.getElementById("importFile");

function addWords(id, words) {
  for (var i = 0; i < words.length; i++) {
    words[i].setid = id;
    dbcrud.addWords(words[i]);
  }
}

var parseExcel = function(fileName, file) {
  var reader = new FileReader();


  reader.onload = function(e) {
    var json_obj;
    var count = isNaN(localStorage.getItem("count")) ? 0 : parseInt(localStorage.count);
    var tableName = [];

    if (!isNaN(localStorage.getItem("tableName"))) {
      tableName = localStorage.getItem("tableName");
    }

    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });

    workbook.SheetNames.forEach(function(sheetName) {
      var sheetWords = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      json_obj = JSON.stringify(sheetWords);
      // localStorage.setItem("dataSet" + count, json_obj);
      count++;
      var tableName = fileName + " - " + sheetName;
      dbcrud.setVocabSet(tableName, sheetWords);
      // dbcrud.getSetId(tableName, json_obj);
    });
    // localStorage.setItem("count", count);
    // localStorage.setItem("tableName", JSON.stringify(tableName));
    alert("Import Success!");
    resetForm();
  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
};


function fileHandler(name, ele) {
  var files = ele.files;
  parseExcel(name, files[0]);
}

function resetForm() {
  var form = document.getElementById("importForm");
  form.reset();
}


importForm.addEventListener("change", function() {
  $("#emptyFileAlert").addClass("d-none");
}, false);

$("#submit").click(function() {
  var valid = true;
  if ($("#importName").val() == '') {
    $("#emptyNameAlert").removeClass("d-none");
    valid = false;
  }
  if (importForm.files.length == 0) {
    $("#emptyFileAlert").removeClass("d-none");
    valid = false;
  }
  if (valid) {
    fileHandler($("#importName").val(), importForm);
  }
});