//JavaScript source code

//Update page first load
setToastrOptions();
onUpdate();
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
    console.log('Declansez operatia de sincronizare a itemilor toDo intre tabele');
    onUpdate();
    setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    setToDoTextBoxText();
});