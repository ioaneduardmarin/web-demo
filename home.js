//JavaScript source code

//Update page first load
onUpdate();
setTextIfNoToDoItems();

//Trigger addToDoItem to create a li element when the addTodoButton was pressed
const addButton = document.getElementById('addTodoButton');
addButton.addEventListener('click', function () {
    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();
});

//Trigger addToDoItem to create a li element when the form was submitted on enter key press
document.getElementById('inputForm').addEventListener('submit', function (event) {
    event.preventDefault();
    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();
});

//Updates the page when the local storage is modified
window.addEventListener('storage', (e) => {
    console.log('Declansez operatia de sincronizare a itemilor toDo intre tabele');
    onUpdate();
    setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    setToDoTextBoxText();
});