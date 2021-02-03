// JavaScript source code
setTextIfNoToDoItems();

const addButton = document.getElementById('addTodoButton');
addButton.addEventListener('click', function () {
    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();
});

//document.addEventListener("keyup", function (event) {
//    if (document.activeElement === document.getElementById('addTodoTextBox') && event.keyCode === 13) {
//        addToDoItem(getToDoTextBoxText());
//        setTextIfNoToDoItems();
//    }
//});