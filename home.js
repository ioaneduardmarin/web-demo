//JavaScript source code
onUpdate();
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
    console.log("Declansez operatia de sincronizare a itemilor toDo intre tabele");
    onUpdate();
    setTextIfNoToDoItems();
});

window.addEventListener('load', () => {
    setToDoTextBoxText();
});