var dbcrud = {
  getVocabSet: function() {
    $.ajax({
      url: '/getSet',
      type: 'POST',
      success: function(res) {
        // console.log("SUCCESS RECEIVED");
        console.log(res);
        addCards(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  },
  setVocabSet: function(param) {
    $.ajax({
      url: '/addSet',
      type: 'POST',
      data: param,
      success: function(res) {
        console.log("SUCCESS RECEIVED");
        console.log(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  },
  getFirstThreeWords: function(setid, obj) {
    $.ajax({
      url: '/getWords',
      type: 'POST',
      success: function(res) {
        // console.log("SUCCESS RECEIVED");
        // console.log(res);
        displayFirstThreeWords(res, setid, obj);
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
};


/*module.exports = {
  getVocabSet,
  setVocabSet
};*/