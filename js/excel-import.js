var parseExcel = function(file) {
  var reader = new FileReader();
  var json_obj;
  // console.log(reader);

  reader.onload = function(e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });

    workbook.SheetNames.forEach(function(sheetName) {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      json_obj = JSON.stringify(XL_row_object);
      localStorage.dataSet = json_obj;
    });
    alert("Import Success!");
    // resetForm();
  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
};


function fileHandler(event) {
  var files = event.target.files;
  parseExcel(files[0]);
}

function resetForm(){
  var form = document.getElementById("importForm");
  form.reset();
}

var importForm = document.getElementById("importFile");
importForm.addEventListener("change", fileHandler, false);

// $("#submit").click(function(){
//   importForm.addEventListener("change", fileHandler, false);
// });


