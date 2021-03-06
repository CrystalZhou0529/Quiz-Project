const numOfGames = 10;
const numOfChoices = 4;
const commonBtnClass = "btn btn-outline-secondary btn-block"
const correctBtnClass = "btn btn-success btn-block";
const incorrectBtnClass = "btn btn-danger btn-block";
const correctInputClass = "form-control btn-success";
const incorrectInputClass = "form-control btn-outline-danger";
const normalInputClass = "form-control";

const MULTIPLE_CHOICE = 0;
const FILL_IN_THE_BLANK = 1;
const PRONUNCIATION = 2;


var nextBtn = document.getElementById("next");

var setName = "";
var dataSet = [];
var dataLength = 0;

var choices = document.getElementsByClassName("btn-block");
var correct = {};
var currType = 0;
var hintCount = 0;

local_init();

function local_init() {
  var setID = parseInt(window.location.href.split("=")[1]);
  console.log(setID);
  setName = "dataSet" + setID;
  dataSet = JSON.parse(localStorage.getItem(setName));
  dataLength = dataSet.length;

  for (var i in dataSet) {
    dataSet[i].success = !dataSet[i].success ? 0 : parseInt(dataSet[i].success);
    dataSet[i].fail = !dataSet[i].fail ? 0 : parseInt(dataSet[i].fail);
  }
  updateRecord();
}

function onClick(ele, f) {
  var obj = document.getElementById(ele);
  obj.onclick = f;
}


function updateChoices() {
  currType = parseInt(Math.random() * 2);
  if (currType == 0) {
    multipleChoice();
  } else if (currType == 1) {
    fillInTheBlank();
  }
}

function multipleChoice() {
  $("#fill-in-blank").hide();
  $("#choices").show();
  $("#hint").hide();
  
  var questionType = parseInt(Math.random() * 2);
  var answerType = "";
  if (questionType == 0) {
    questionType = "fr";
    answerType = "en";
  } else {
    questionType = "en";
    answerType = "fr";
  }
  correct = randomQuestionGenerator(dataSet, questionType, answerType);
  var questionText = document.getElementById("problem-description");
  questionText.innerHTML = dataSet[correct.btnsInDataset[correct.posInBtn]][questionType];
  btnSubmit();
}

function randomNumGenerator(range, num) {
  var arr = [];
  var set = new Set();
  while (set.size < num) {
    set.add(parseInt(Math.random() * range));
  }
  arr = Array.from(set);
  return arr;
}

function randomQuestionGenerator(data, questionType, answerType) {
  var answersNum = randomNumGenerator(dataLength, numOfChoices);
  var questionPos = findLeastCorrectWord(answersNum);
  for (var j = 0; j < numOfChoices; j++) {
    var btn = choices[j];
    btn.className = commonBtnClass;
    btn.innerHTML = data[answersNum[j]][answerType]
  }
  var obj = {
    btnsInDataset: answersNum,
    posInBtn: parseInt(questionPos)
  };
  return obj;
}

function btnSubmit() {
  for (var i = 0; i < numOfChoices; i++) {
    choices[i].onclick = clientAnswer;
  }
}

function clientAnswer() {
  var choiceId = parseInt(this.id.substring(6)) - 1;
  if (choiceId == correct.posInBtn) {
    this.className = correctBtnClass;
    var objNumInDataSet =correct.btnsInDataset[choiceId];
    resultUpdate(objNumInDataSet, "success");
    
    // console.log(dataSet[correct.btnsInDataset[choiceId]]);
    updateRecord();
    setTimeout(() => {
      updateChoices();
    }, 500);
  } else {
    var objNumInDataSet = correct.btnsInDataset[choiceId];
    var correctNumInDataSet = correct.btnsInDataset[correct.posInBtn];
    resultUpdate(objNumInDataSet, "fail");
    resultUpdate(correctNumInDataSet, "fail");
    // console.log(dataSet[objNumInDataSet]);
    this.className = incorrectBtnClass;
    updateRecord();
  }
}

function resultUpdate(num, type) {
  dataSet[num][type] += 1;
}

function updateRecord() {
  localStorage.setItem(setName, JSON.stringify(dataSet));
  console.log(dataSet);
}

function findLeastCorrectWord(a) {
  var min = 1;
  var minPos = 0;
  for (var i in a) {
    var obj = dataSet[a[i]];
    var percent = (obj.fail + obj.success == 0) ? 0 : (obj.success - obj.fail) / (obj.success + obj.fail);
    if (percent < min) {
      min = percent;
      minPos = i;
    }
    // console.log(obj);
  }
  return minPos;
}

function fillInTheBlank() {
  $("#fill-in-blank").show();
  $("#choices").hide();
  $("#hint").show();
  correct = {};
  correct.ansInDataset = randomNumGenerator(dataLength, 1)[0];
  var questionText = document.getElementById("problem-description");
  questionText.innerHTML = dataSet[correct.ansInDataset].en;
  var clientInput = document.getElementById("blankInput");
  clientInput.className = "form-control";
  clientInput.value = "";
}


const specialCharsReg = /[\.,?!"']/ig;

function checkInputAns() {
  var clientInput = document.getElementById("blankInput")
  var clientAns = clientInput.value;
  var ans = dataSet[correct.ansInDataset].fr;
  clientAns = clientAns.toLowerCase();
  ans = ans.toLowerCase();
  clientAns = clientAns.replaceAll(specialCharsReg, '');
  ans = ans.replaceAll(specialCharsReg, '');
  if (ans == clientAns) {
    resultUpdate(correct.ansInDataset, "success");
    clientInput.className = correctInputClass;
    setTimeout(() => {
      updateChoices();
    }, 500);
  } else {
    resultUpdate(correct.ansInDataset, "fail");
    clientInput.className = incorrectInputClass;
  }
  updateRecord();
}

onClick("next", function() {
  switch (currType) {
    case MULTIPLE_CHOICE:
      if (correct.posInBtn < numOfChoices) {
        console.log(correct);
        var correctBtn = document.getElementById("choice" + (correct.posInBtn+1));
        console.log(correctBtn);
        correctBtn.className = correctBtnClass;
        resultUpdate(correct.btnsInDataset[correct.posInBtn], "fail");
        setTimeout(() => {
          updateChoices();
        }, 500);
      } else {
        updateChoices();
      }
      break;

    case FILL_IN_THE_BLANK:
      checkInputAns();
      break;

  }
  
});

onClick("skip", updateChoices);

$("#blankInput").keypress(function(event){
  if (event.keyCode == 13) {
    event.preventDefault();
    $("#next").click();
    return false;
  }
});

$("#blankInput").click(function() {
  $(this).removeClass("btn-outline-danger");
  // console.log(this);
});

$("#hint").click(function(){
  var clientInput = document.getElementById("blankInput");
  var clientAns = clientInput.value;
  var ans = dataSet[correct.ansInDataset].fr.toLowerCase();
  var i = 0;
  while (i < ans.length) {
    if (i >= clientAns.length) {
      clientInput.value = clientAns + ans[i];
      break;
    }
    if (clientAns[i].toLowerCase() != ans[i]) {
      clientInput.value = clientAns.substring(0, i - 1) + ans[i];
      break;
    }
    i++;
  }
});

$(document).keypress(function(event) {
  if (currType == MULTIPLE_CHOICE) {
    var choiceId = event.keyCode - 48;
    $("#choice" + choiceId).click();
  }
});