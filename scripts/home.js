
//Update page first load
getSyncData();
setToastrOptions();
onUpdate('');
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
    onUpdate('localStorageArgs', '');
    setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    setToDoTextBoxText();
});