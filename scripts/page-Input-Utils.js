//Gets text from input element
function getToDoTextBoxText() {
    return document.querySelector('#addTodoTextBox').value;
}

//Resets input text content state to empty
function setToDoTextBoxText() {
    document.querySelector('#addTodoTextBox').value = '';
}

//Sets the visibility state of the element with id equal to 'noToDoItemInfo'
function setTextIfNoToDoItems() {
    document.querySelector('#noToDoItemInfo').hidden = doTodoItemsExist();
}

//Checks if the parent div element has children elemens
function doTodoItemsExist() {
    let number = document.querySelector('#toDoList').childElementCount;
    if (parseInt(number) > 0) {
        return true;
    }
    return false;
}

module.exports= {
    getToDoTextBoxText: getToDoTextBoxText,
    setToDoTextBoxText: setToDoTextBoxText,
    setTextIfNoToDoItems: setTextIfNoToDoItems
}