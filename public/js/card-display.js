const maxCardsPerRow = 3;
const maxWordsPerCard = 3;

var cardsArea = document.getElementById("cards");
// var tableName = JSON.parse(localStorage.getItem("tableName"));
//parseInt(localStorage.getItem("count"));


function displayFirstThreeWords(data, setID, listObj) {
  // var data = dbcrud.getWords(setID);
  // console.log(data);
  var str = "";
  for (var i = 0; i < Math.min(maxWordsPerCard, data.length); i++) {
    str += data[i]["fr"];
    str += "<br/>";
  }
  // console.log(str);
  listObj.innerHTML = str;
}

function appendCard(row, i, setObj) {
  var quizBtn = document.createElement("button");
  quizBtn.type = "button";
  quizBtn.className = "btn btn-primary btn-quiz";
  quizBtn.innerHTML = "Quiz";
  quizBtn.onclick = function() {
    bindBtn("quiz", i);
  };

  var listBtn = document.createElement("button");
  listBtn.type = "button";
  listBtn.className = "btn btn-primary btn-list";
  listBtn.innerHTML = "View List";
  listBtn.onclick = function() {
    bindBtn("list", i);
  };

  var newLayout = document.createElement("div");
  newLayout.className = "col-md-4";
  var newCard = document.createElement("div");
  newCard.className = "card";
  var cardBody = document.createElement("div");
  cardBody.className = "card-body";

  var cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.innerHTML = setObj.setname;

  var cardText = document.createElement("p");
  cardText.className = "card-text";
  console.log(cardText);
  dbcrud.getFirstThreeWords(setObj.id, cardText);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(quizBtn);
  cardBody.appendChild(listBtn);
  newCard.appendChild(cardBody);
  newLayout.appendChild(newCard);
  row.appendChild(newLayout);
}

function displayCard(setName, i, setObj) {
  var lastRow = cardsArea.lastElementChild;
  if (lastRow.children.length == maxCardsPerRow) {
    var newRow = document.createElement("div");
    newRow.className = "row";
    appendCard(newRow, i, setObj);
    cardsArea.appendChild(newRow);
  } else {
    appendCard(lastRow, i, setObj);
  }
}

function addCards(data) {
  // var data = dbcrud.getVocabSet();
  console.log(data);
  var cardsCount = data.length;
  for (var i = 0; i < cardsCount; i++) {
    displayCard("dataSet" + data[i].id, i, data[i]);
  }
}

function bindBtn(pageName, i) {
  url = pageName + ".html?dataset=" + i;
  window.location.href = url;
}


dbcrud.getVocabSet();