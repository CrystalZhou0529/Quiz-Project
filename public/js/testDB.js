var addContact = function() {
  var name = $("#name").val();
  var age = $("#age").val();
  $.ajax({
    url: '/searchVocab',
    type: 'POST',
    success: function(res) {
      console.log("SUCCESS RECEIVED");
      console.log(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

var getContact = function() {
  $.ajax({
    url: '/test',
    type: 'GET',
    success: function(res) {
      console.log("Final result: " + res);
    }
  });
}

$("#submit").click(addContact);