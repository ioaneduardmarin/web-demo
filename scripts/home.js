//JavaScript source code

//Update page first load
setToastrOptions();
getSyncData();
onUpdate(app.toDoItems,'');
setTextIfNoToDoItems();

$('#addTodoButton').click(function () {
    addNewToDoItem();
});

$('#inputForm').submit(function (event) {
    event.preventDefault();
    addNewToDoItem();
});

//Updates the page when the local storage is modified
window.addEventListener('storage', (e) => {
    onUpdate(app.toDoItems, '');
    setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    setToDoTextBoxText();
});