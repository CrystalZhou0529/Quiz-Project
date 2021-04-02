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
  addWords: function(data) {
    $.ajax({
      url: '/addWords',
      type: 'POST',
      data: data,
      success: function(res) {

      },
      error: function(err) {
        console.log(err);
      }
    });
  },
  setVocabSet: function(param, words) {
    $.ajax({
      url: '/addSet',
      type: 'POST',
      data: {
        setname: param
      },
      success: function(res) {
        console.log("SUCCESS RECEIVED");
        addWords(res.insertId, words);

      },
      error: function(err) {
        console.log(err);
      }
    });
  },

  getSetId: function(setname, data) {
    $.ajax({
      url: '/getSetId',
      type: 'POST',
      data: {
        setname: setname
      },
      success: function(res) {
        console.log("res: " + res);
        var id = (res) ? res[0].id : 1;
        for (var i in data) {
          data[i].setid = id;
          this.addWords(data[i]);
        }
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
      data: {
        id: setid
      },
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