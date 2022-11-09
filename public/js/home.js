let nameInput;
let startButton;

window.onload = function () {
    console.log("loaded");
    nameInput = document.getElementById("name");
    startButton = document.getElementById("start");

    // get name from local storage
    let name = localStorage.getItem("name");
    if (name) {
        nameInput.value = name;
    }

    startButton.addEventListener("click", startGame);

    getScores();
};

function startGame() {
    if (nameInput.value.length > 0) {
        localStorage.setItem("name", nameInput.value);
        window.location.href = "game.html";
    } else {
        alert("Please enter a name");
    }
}

function getScores() {
    let n = 10;
    fetch(`/api/get-scores?n=${n}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            displayScores(data);
        });
}

function tableHeading(tableBody) {
    let tableItem = document.createElement("tr");
    let rankItem = document.createElement("th");
    let nameItem = document.createElement("th");
    let scoreItem = document.createElement("th");

    rankItem.innerText = "Rank";
    nameItem.innerText = "Name";
    scoreItem.innerText = "Score";

    tableItem.appendChild(rankItem);
    tableItem.appendChild(nameItem);
    tableItem.appendChild(scoreItem);

    tableItem.classList.add("table-heading");
    tableBody.appendChild(tableItem);
}

function displayScores(scores) {
    let tableBody = document.getElementById("table");
    tableBody.innerHTML = "";
    tableHeading(tableBody);
    scores.forEach((score, index) => {
        tableBody.appendChild(
            createTableItem(index + 1, score.name, score.score)
        );
    });
}

function createTableItem(rank, name, score) {
    let tableItem = document.createElement("tr");
    let rankItem = document.createElement("td");
    let nameItem = document.createElement("td");
    let scoreItem = document.createElement("td");

    rankItem.innerText = rank;
    nameItem.innerText = name;
    scoreItem.innerText = score;

    tableItem.appendChild(rankItem);
    tableItem.appendChild(nameItem);
    tableItem.appendChild(scoreItem);

    return tableItem;
}
