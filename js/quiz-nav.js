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

// local_init() initializes the word set and change all null value to 0.
// effects: modifies setName, dataSet, dataLength
// requires: window.location.href contains "="
function local_init() {
  var setID = parseInt(window.location.href.split("=")[1]);
  // console.log(setID);
  setName = "dataSet" + setID;
  dataSet = JSON.parse(localStorage.getItem(setName));
  dataLength = dataSet.length;

  for (var i in dataSet) {
    dataSet[i].success = !dataSet[i].success ? 0 : parseInt(dataSet[i].success);
    dataSet[i].fail = !dataSet[i].fail ? 0 : parseInt(dataSet[i].fail);
  }
  updateRecord();
}

///////////////////////////////////////////////////////////////////////////////
//
// Commonly used functions
//
///////////////////////////////////////////////////////////////////////////////

// onclick(ele, f) binds the function f to the element that id=ele.
// onclick: string function -> void
// requires: f is not null
//           there exists some element such that id = ele
function onClick(ele, f) {
  console.assert(f, "Null function binded");
  console.assert(document.getElementById(ele), "No element whose id = " + ele);
  var obj = document.getElementById(ele);
  obj.onclick = f;
}

// randomNumGenerator(range, num) generates the array of length num that contains
//   random integers in [0, range).
// randomNumGenerator: Num Int -> Int[]
// requires: range >= 0
//           len >= 0
function randomNumGenerator(range, len) {
  console.assert(range >= 0, "[randomNumGenerator]: range < 0");
  console.assert(len >= 0, "[randomNumGenerator]: len < 0");
  var arr = [];
  while (arr.length < len) {
    arr.push(parseInt(Math.random() * range));
  }
  return arr;
}

// updateRecord() uploads the dataSet record to localStorage
// effects: modifies localStorage
function updateRecord() {
  localStorage.setItem(setName, JSON.stringify(dataSet));
}

// resultUpdate(num, type) adds one to the property type in dataSet[num]
// effects: modifies dataSet[num]
// requires: num < dataSet.length [not asserted]
function resultUpdate(num, type) {
  if (!dataSet[num][type]) {
    dataSet[num][type] = 1;
  } else {
    dataSet[num][type] += 1;
  }
}

// findLeastCorrectWord(a) returns the index of item in array a that word in dataSet[a[index]]
//   has lowest correct rate.
// findLeastCorrectWord: int[] -> int
// requires: a is not null
function findLeastCorrectWord(a) {
  console.assert(a, "[findLeastCorrectWord]: null array");
  var min = 1;
  var minPos = 0;
  for (var i in a) {
    var obj = dataSet[a[i]];
    var percent = (obj.fail + obj.success == 0) ? 0 : (obj.success - obj.fail) / (obj.success + obj.fail);
    if (percent < min) {
      min = percent;
      minPos = i;
    }
  }
  return minPos;
}

///////////////////////////////////////////////////////////////////////////////
//
// Mutiple Choices Core Functions
//
///////////////////////////////////////////////////////////////////////////////

// randomQuestionGenerator(data, answerType) generates the object of MC choices
//   and the correct answer.
// randomQuestionGenerator: Object[] String -> Object
// note: format of return Object {
//         int btnsInDataset    // Positions of btn texts in dataSet, 4个选项所在位置
//         int posInBtn         // Position of correct choice in 4 buttons, [0-3]
//       }
//       format of answerType: one of "fr", "en"
// effects: modifies texts of 4 choice HTMLButtonElement

function randomQuestionGenerator(data, answerType) {
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


// clientAnswer() binds functions to each HTMLButtonElement
// note: if the correct button is clicked, then updateChoices is called
//       and the client will move on to the next function. If the incorrect
//       button is clicked, then the client still need to click again to
//       find the correct answer.
//       Keyword "this" means the clicked button
// effects: modifies className of this

function clientAnswer() {
  var choiceId = parseInt(this.id.substring(6)) - 1;

  if (choiceId == correct.posInBtn) {
    // Click the correct button
    this.className = correctBtnClass;
    var objNumInDataSet =correct.btnsInDataset[choiceId];
    resultUpdate(objNumInDataSet, "success");
    updateRecord();
    setTimeout(() => {
      updateChoices();
    }, 500);

  } else {
    // Click any incorrect button
    var objNumInDataSet = correct.btnsInDataset[choiceId];
    var correctNumInDataSet = correct.btnsInDataset[correct.posInBtn];
    resultUpdate(objNumInDataSet, "fail");
    resultUpdate(correctNumInDataSet, "fail");
    // console.log(dataSet[objNumInDataSet]);
    this.className = incorrectBtnClass;
    updateRecord();
  }
}


// btnSubmit() binds the onclick functions to all choices HTMLButtonElement
// effects: modifies choices[i]
function btnSubmit() {
  for (var i = 0; i < numOfChoices; i++) {
    choices[i].onclick = clientAnswer;
  }
}





///////////////////////////////////////////////////////////////////////////////
//
// Fill in the blank Core Functions
//
///////////////////////////////////////////////////////////////////////////////

// Special chars that are ignored during string comparison
const specialCharsReg = /[\.,?!"']/ig;


// checkInputAns() checks the client input and moves on the the next question if
//   the answer is correct.
// effects: calls updateChoices
//          modifies localStorage through updateRecord()
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


///////////////////////////////////////////////////////////////////////////////
//
// Control flow functions
//
///////////////////////////////////////////////////////////////////////////////

// updateChoices() decides the type of the next questions and moves on
// effects: modifies currType
function updateChoices() {
  currType = parseInt(Math.random() * 2);
  if (currType == 0) {
    multipleChoice();
  } else if (currType == 1) {
    fillInTheBlank();
  }
}


// multipleChoice() overall manages functions regarding MC questions and displays
//   the question text.
// effects: modifies visibility of some HTMLButtonElement
//          modifies correct
//          modifies #problem-description.innerHTML

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
  correct = randomQuestionGenerator(dataSet, answerType);
  var questionText = document.getElementById("problem-description");
  questionText.innerHTML = dataSet[correct.btnsInDataset[correct.posInBtn]][questionType];
  btnSubmit();
}


// fillInTheBlank() overall manages functions of filling in the blank
// effects: modifies visibility of some HTMLButtonElement
//          modifies className of text input

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


///////////////////////////////////////////////////////////////////////////////
//
// HTML DOM Binding
//
///////////////////////////////////////////////////////////////////////////////

// Event: #next.onclick
// note: It determines if the client's answer is correct for different types of
//       questions. If it is correct, the client will move onto the next question
//       and otherwise not.
onClick("next", function() {
  switch (currType) {
    case MULTIPLE_CHOICE:
      if (correct.posInBtn < numOfChoices) {
        // console.log(correct);
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


// Event: #skip.onclick
// note: updates the question directly without recording if the question is answered
//       correctly or incorrectly.
onClick("skip", updateChoices);


// Event: #blankInput.keypress
// note: If enter is pressed, then it is the same as clicking "Next" button
//       We will compare client's answer with standard answer and display the
//       result.
$("#blankInput").keypress(function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    $("#next").click();
    return false;
  }
});


// Event: #blankInput.onclick
// note: It removes the class of displaying wrong answer
$("#blankInput").click(function() {
  $(this).removeClass("btn-outline-danger");
});


// Event: #hint.onclick
// note: One additional correct character will be displayed in #blankInput
//       that gives the client a hint
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


// Event: document.keypress
// note: supports keyboard answers for MC questions. Number [1-4] means clicking the
//       corresponding button
$(document).keypress(function(event) {
  if (currType == MULTIPLE_CHOICE) {
    var choiceId = event.keyCode - 48;
    $("#choice" + choiceId).click();
  }
});
