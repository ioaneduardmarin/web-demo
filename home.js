//JavaScript source code
onLoad();
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