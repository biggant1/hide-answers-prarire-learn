const bannedSelectors = [".badge-success", ".grading-block", "div[data-testid]", ".mathjax_ignore"]
let checkedElements = [];
let oldTextValue = ""

function uncheckAllBoxes() {
    document.querySelectorAll(".form-check-input").forEach(elem => {
        elem.checked = false;
    })
}

function hideElements() {
    for (let bannedSelector of bannedSelectors) {
        document.querySelectorAll(bannedSelector).forEach(element => {
            element.style.visibility = "hidden";
        })
    }

    checkedElements = Array.from(document.querySelectorAll("input:checked"));
    uncheckAllBoxes();

    let input = document.querySelector("input[type=text]");
    if (input) {
        oldTextValue = input.value;
        input.value = "";
    }
}
hideElements();

function showElements() {
    for (let bannedSelector of bannedSelectors) {
        document.querySelectorAll(bannedSelector).forEach(element => {
            element.style.visibility = "visible";
        })
    }
    uncheckAllBoxes();
    checkedElements.forEach(elem => elem.checked = true);

    let input = document.querySelector("input[type=text]");
    if (input) {
        input.value = oldTextValue;
    }
}


let showButton = document.querySelector(".question-grade")
if(!showButton) {
    showButton = document.querySelector("#question-panel-footer")
}
showButton.textContent = "Show Correct Answers";

showButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    showElements();
})
