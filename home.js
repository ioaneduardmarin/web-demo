// JavaScript source code
setTextIfNoToDoItems();

const addButton = document.getElementById('addTodoButton');
addButton.addEventListener('click', function () {
    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        addToDoItem(getToDoTextBoxText());
        event.preventDefault();
        setTextIfNoToDoItems();
    }
});