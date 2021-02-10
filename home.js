//JavaScript source code
onLoad('loadPage');
setTextIfNoToDoItems();

const addButton = document.getElementById('addTodoButton');
addButton.addEventListener('click', function () {
    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();
});

document.getElementById('toDoForm').addEventListener('submit', function (event) {
    event.preventDefault();
    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();
});

window.addEventListener('storage', (e) => {
    
    popElements('toDoList');
    onLoad('storageEventListener');
    setTextIfNoToDoItems();
});

window.addEventListener('load',() => {
    setToDoTextBoxText();
});