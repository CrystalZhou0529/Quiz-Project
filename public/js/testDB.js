var addContact = function() {
  var name = $("#name").val();
  var age = $("#age").val();
  var data = JSON.stringify({
    name: name,
    age: age
  });
  $.ajax({
    url: '/addContact',
    type: 'GET',
    data: data,
    success: function(res) {
      getContact();
    }
  });
}

var getContact = function() {
  $.ajax({
    url: '/test',
    type: 'GET',
    success: function(res) {
      console.log(res);
    }
  });
}

$("#submit").click(addContact);