const maxCardsPerRow = 3;
const maxWordsPerCard = 3;

var cardsArea = document.getElementById("cards");
var tableName = JSON.parse(localStorage.getItem("tableName"));
var cardsCount = parseInt(localStorage.getItem("count"));


function displayFirstThreeWords(setName, i) {
  var data = JSON.parse(localStorage.getItem(setName));
  var str = "";
  for (var i = 0; i < Math.min(maxWordsPerCard, data.length); i++) {
    str += data[i]["fr"];
    str += "<br/>";
  }
  return str;
}

function appendCard(row, setName, i) {
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
  cardTitle.innerHTML = tableName[i];

  var cardText = document.createElement("p");
  cardText.className = "card-text";
  cardText.innerHTML = displayFirstThreeWords(setName, i);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(quizBtn);
  cardBody.appendChild(listBtn);
  newCard.appendChild(cardBody);
  newLayout.appendChild(newCard);
  row.appendChild(newLayout);
}

function displayCard(setName, i) {
  var lastRow = cardsArea.lastElementChild;
  if (lastRow.children.length == maxCardsPerRow) {
    var newRow = document.createElement("div");
    newRow.className = "row";
    appendCard(newRow, setName, i);
    cardsArea.appendChild(newRow);
  } else {
    appendCard(lastRow, setName, i);
  }
}

function addCards() {
  for (var i = 0; i < cardsCount; i++) {
    displayCard("dataSet" + i, i);
  }
}

function bindBtn(pageName, i) {
  url = pageName + ".html?dataset=" + i;
  window.location.href = url;
}


addCards();