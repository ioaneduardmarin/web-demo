// JavaScript source code
//Gets text from input element
function getToDoTextBoxText() {
    return window.document.querySelector('#addTodoTextBox').value;
}

//Resets input text content state to empty
function setToDoTextBoxText() {
    window.document.querySelector('#addTodoTextBox').value = '';
}

//Sets the visibility state of the element with id equal to 'noToDoItemInfo'
function setTextIfNoToDoItems() {
    window.document.querySelector('#noToDoItemInfo').hidden = doTodoItemsExist();
}

//Checks if the parent div element has children elemens
function doTodoItemsExist() {
    let number = window.document.querySelector('#toDoList').childElementCount;
    if (parseInt(number) > 0) {
        return true;
    }
    return false;
}

//Deletes al div elements
function popElements() {
    let toDoItems = window.document.querySelectorAll('#toDoList > .toDoItem');
    toDoItems.forEach(element => element.parentNode.removeChild(element));
}

module.exports = {
    getToDoTextBoxText: getToDoTextBoxText,
    setToDoTextBoxText: setToDoTextBoxText,
    setTextIfNoToDoItems: setTextIfNoToDoItems,
    doTodoItemsExist: doTodoItemsExist,
    popElements: popElements
}