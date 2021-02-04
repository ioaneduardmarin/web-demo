// JavaScript source code
const app = {
    numberOfToDoItems: 0,
    toDoItems: [],
    addedItemsTimeLog: [],
    removedItemsTimeLog: []
};

function getToDoTextBoxText() {
    return document.getElementById('addTodoTextBox').value;
}

function setToDoTextBoxText() {
    document.getElementById('addTodoTextBox').value = '';
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
        return;
    }

    app.numberOfToDoItems++;
    let list = document.getElementById('toDoList');
    let newEntry = prepareToDoItem();
    let toDoItemSpan = prepareToDoItemSpan(toDoItemText);
    let removalAnchor = prepareToDoItemRemovalAnchor();

    newEntry.appendChild(toDoItemSpan);
    newEntry.appendChild(removalAnchor);

    toDoItemSpan.addEventListener('blur', function (event) {
        editToDoItem(toDoItemSpan.id);
        event.preventDefault();
        setTextIfNoToDoItems();
    });

    removalAnchor.addEventListener('click', function (event) {
        deleteToDoItem(newEntry.id);
        event.preventDefault();
        setTextIfNoToDoItems();
    });

    newEntry.addEventListener('click', function (event) {
        toDoItemSpan.focus(true);
    });

    list.appendChild(newEntry);
    setToDoTextBoxText();
    app.toDoItems.push(newEntry);
    app.addedItemsTimeLog.push(toDoItemSpan.textContent, getCurrentDate());
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

function prepareToDoItem() {
    let newEntry = document.createElement('li');
    newEntry.id = `toDoItem${app.numberOfToDoItems}`;
    newEntry.className = 'toDoItem';
    return newEntry;
}

function prepareToDoItemSpan(toDoItemText) {

    let span = document.createElement('span');
    span.class = 'toDoItemText';
    span.id = `toDoItemSpan${app.numberOfToDoItems}`;
    span.textContent = toDoItemText;
    span.contentEditable = true;
    span.spellcheck = false;
    return span;
}

function deleteToDoItem(id) {
    let toBeDeleted = document.getElementById(id);
    toBeDeleted.parentNode.removeChild(toBeDeleted);
    app.toDoItems.slice(app.toDoItems.indexOf(toBeDeleted), app.toDoItems.indexOf(toBeDeleted) + 1);
    app.removedItemsTimeLog.push(toBeDeleted.firstElementChild.textContent, getCurrentDate());
}

function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    if (toBeEdited.textContent) {
        app.toDoItems.splice(app.toDoItems.indexOf(toBeEdited), 1, toBeEdited);
        return;
    }
    deleteToDoItem(document.getElementById(id).parentNode.id);
}

function getCurrentDate() {
    let date = new Date();
    return date.toLocaleString();
}