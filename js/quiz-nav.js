function Word(){
  this.en = "";
  this.fr = "";
}

function onClick(ele, f) {
  var obj = document.getElementById(ele);
  obj.onclick = f;
}

var nextBtn = document.getElementById("next");

var dataSet = JSON.parse(localStorage.dataSet);
var dataLength = dataSet.length;

const numOfGames = 10;
const numOfChoices = 4;
const commonBtnClass = "btn btn-outline-secondary btn-block"
const correctBtnClass = "btn btn-success btn-block";
const incorrectBtnClass = "btn btn-danger btn-block";


var choices = document.getElementsByClassName("btn-block");
var correct = {};

local_init();

function local_init() {
  for (var i in dataSet) {
    dataSet[i].success = parseInt(dataSet[i].success);
    dataSet[i].fail = parseInt(dataSet[i].fail);
  }
}

function updateChoices() {
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

onClick("next", function() {
  if (correct.posInBtn < numOfChoices) {
    var correctBtn = document.getElementById("choice" + (correct.posInBtn+1));
    correctBtn.className = correctBtnClass;
    resultUpdate(correct.btnsInDataset[correct.posInBtn], "fail");
    setTimeout(() => {
      updateChoices();
    }, 500);
  } else {
    updateChoices();
  }
});

onClick("skip", updateChoices);


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
    posInBtn: questionPos
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
    
    console.log(dataSet[correct.btnsInDataset[choiceId]]);
    updateRecord();
    setTimeout(() => {
      updateChoices();
    }, 500);
  } else {
    var objNumInDataSet = correct.btnsInDataset[choiceId];
    var correctNumInDataSet = correct.btnsInDataset[correct.posInBtn];
    resultUpdate(objNumInDataSet, "fail");
    resultUpdate(correctNumInDataSet, "fail");
    console.log(dataSet[objNumInDataSet]);
    this.className = incorrectBtnClass;
    updateRecord();
  }
}

function resultUpdate(num, type) {
  dataSet[num][type] += 1;
}

function updateRecord() {
  localStorage.dataSet = JSON.stringify(dataSet);
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
