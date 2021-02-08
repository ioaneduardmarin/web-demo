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

    if (app.toDoItems.filter(e => e.contentText === 'toDoItemText').length > 0) {
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

    let toDoObject = new ToDoObject(newEntry.id, toDoItemSpan.textContent);
    list.appendChild(newEntry);
    setToDoTextBoxText();

    window.localStorage.setItem(toDoObject.toDoId, toDoObject.contentText);
    app.toDoItems.push(toDoObject);
    app.addedItemsTimeLog.push(toDoObject, getCurrentDate());
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
    let toDoObject = new ToDoObject(toBeDeleted.id, toBeDeleted.firstChild.textContent);
    toBeDeleted.parentNode.removeChild(toBeDeleted);
    app.toDoItems.slice(
        app.toDoItems.indexOf(toDoObject),
        app.toDoItems.indexOf(toDoObject) + 1);
    app.removedItemsTimeLog.push(toDoObject, getCurrentDate());
    window.localStorage.removeItem(id);
}

function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    let toDoObject = new ToDoObject(toBeEdited.id, toBeEdited.textContent);
    if (toDoObject.contentText) {
        app.toDoItems.splice(
            app.toDoItems.indexOf(toDoObject), 1, toDoObject);
        window.localStorage.removeItem(document.getElementById(id).parentNode.id);
        window.localStorage.setItem(document.getElementById(id).parentNode.id, toDoObject.contentText);
        return;
    }
    window.localStorage.removeItem(document.getElementById(id).parentNode.id);
    deleteToDoItem(document.getElementById(id).parentNode.id);
}

function getCurrentDate() {
    let date = new Date();
    return date.toLocaleString();
}

function onLoad() {
    let myStorage = getMyStorage();
    myStorage.forEach(element => addToDoItem(element));
}

function getMyStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }

    return values;
}

function ToDoObject(identificaton, content) {
    this.toDoId = identificaton;
    this.contentText = content;
}