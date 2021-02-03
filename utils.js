// JavaScript source code
const app = {
    numberOfToDoItems: 0,
    toDoItems: []
};

function getToDoTextBoxText() {
    return document.getElementById('addTodoTextBox').value;
}

function doTodoItemsExist() {
    let number = document.getElementById('toDoList').childElementCount;
    if (parseInt(number) > 0) {
        return true;
    }
    return false;
}

function setTextIfNoToDoItems() {
    document.getElementById('noToDoItemInfo').hidden = doTodoItemsExist();
}

function addToDoItem(toDoItemText) {
    if (!toDoItemText)
    {
        alert("Introduce a valid item!");
        return;
    }

    app.numberOfToDoItems++;
    let list = document.getElementById('toDoList');
    let newEntry = prepareToDoItem(toDoItemText);
    let anchor = prepareToDoItemAnchor();

    newEntry.appendChild(anchor);
    anchor.addEventListener('click', function (event) {
        deleteToDoItem(newEntry.id);
        event.preventDefault();
        setTextIfNoToDoItems();
    });

    list.appendChild(newEntry);
    app.toDoItems.push(newEntry);
}

function prepareToDoItemAnchor() {
    let anchor = document.createElement('a');
    anchor.className = 'removeToDoAnchor';
    anchor.id = `removeToDoAnchor${app.numberOfToDoItems}`;
    anchor.textContent = 'X';
    anchor.href = '#';
    anchor.role = 'button';
    return anchor;
}

function prepareToDoItem(toDoItemText) {
    let newEntry = document.createElement('li');
    newEntry.id = `toDoItem${app.numberOfToDoItems}`;
    newEntry.className = 'toDoItem';
    newEntry.appendChild(document.createTextNode(toDoItemText + " "));
    return newEntry;
}

function deleteToDoItem(id) {
    var toBeDeleted = document.getElementById(`${id}`);
    toBeDeleted.parentNode.removeChild(toBeDeleted);
    app.toDoItems.slice(app.toDoItems.indexOf(toBeDeleted), app.toDoItems.indexOf(toBeDeleted) + 1);
}