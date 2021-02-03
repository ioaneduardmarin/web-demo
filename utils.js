// JavaScript source code
const app = {
    numberOfToDoItems: 0,
    toDoItems: []
};

function getToDoTextBoxText() {
    return document.getElementById('addTodoTextBox').value;
}

function getToDoItemText(id) {
    return document.getElementById(id).textContent.text;
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
    if (!toDoItemText) {
        alert("Introduce a valid item!");
        return;
    }

    app.numberOfToDoItems++;
    let list = document.getElementById('toDoList');
    let newEntry = prepareToDoItem(toDoItemText);
    let removalAnchor = prepareToDoItemRemovalAnchor();
    let editingAnchor = prepareToDoItemEditingAnchor();

    newEntry.appendChild(removalAnchor);
    newEntry.appendChild(editingAnchor);

    removalAnchor.addEventListener('click', function (event) {
        deleteToDoItem(newEntry.id);
        event.preventDefault();
        setTextIfNoToDoItems();
    });

    editingAnchor.addEventListener('click', function (event) {
        editToDoItem(newEntry.id);
        event.preventDefault();
        setTextIfNoToDoItems();
    });

    list.appendChild(newEntry);
    app.toDoItems.push(newEntry);
}

function prepareToDoItemRemovalAnchor() {
    let anchor = document.createElement('a');
    anchor.style.padding = "3px 3px 3px 5px";
    anchor.className = 'removalToDoAnchor';
    anchor.id = `removalToDoAnchor${app.numberOfToDoItems}`;
    anchor.textContent = 'X';
    anchor.href = '#';
    anchor.role = 'button';
    return anchor;
}

function prepareToDoItemEditingAnchor() {
    let anchor = document.createElement('a');
    anchor.style.padding = "3px 3px 3px 0px";
    anchor.className = 'editingToDoAnchor';
    anchor.id = `editingToDoAnchor${app.numberOfToDoItems}`;
    anchor.textContent = 'Edit Item';
    anchor.href = '#';
    anchor.role = 'button';
    return anchor;
}

function prepareToDoItem(toDoItemText) {
    let newEntry = document.createElement('li');
    newEntry.id = `toDoItem${app.numberOfToDoItems}`;
    newEntry.className = 'toDoItem';
    newEntry.appendChild(document.createTextNode(toDoItemText));
    newEntry.addEventListener('dblclick', function () {
        newEntry.contentEditable = true;
    });
    return newEntry;
}

function deleteToDoItem(id) {
    let toBeDeleted = document.getElementById(`${id}`);
    toBeDeleted.parentNode.removeChild(toBeDeleted);
    app.toDoItems.slice(app.toDoItems.indexOf(toBeDeleted), app.toDoItems.indexOf(toBeDeleted) + 1);
}

function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    toBeEdited.contentEditable = false;
    if (!toBeEdited.innerText) {
        deleteToDoItem(id);
    }
    app.toDoItems.splice(app.toDoItems.indexOf(toBeEdited), 1, toBeEdited);
}