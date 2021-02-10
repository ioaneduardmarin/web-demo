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

    let toDoObject = { toDoId: newEntry.id, contentText: toDoItemSpan.textContent };
    list.appendChild(newEntry);
    setToDoTextBoxText();

    console.log("Adaug un item nou in localStorage");
    window.localStorage.setItem(toDoObject.toDoId, toDoObject.contentText);
    app.toDoItems.push(toDoObject);
    app.addedItemsTimeLog.push(toDoObject, getCurrentDate());
}

function addItemsOnUpdate(toDoItemText) {
    if (!toDoItemText) {
        return;
    }

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

    let toDoObject = { toDoId: newEntry.id, contentText: toDoItemSpan.textContent };
    list.appendChild(newEntry);
    setToDoTextBoxText();
    app.numberOfToDoItems++;
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
    if (!toBeDeleted) {
        return;
    }

    let toDoObject = { toDoId: id, contentText: toBeDeleted.firstChild.textContent };
    toBeDeleted.parentNode.removeChild(toBeDeleted);

    const indexToBeDeleted = (app.toDoItems).findIndex(elem => elem.toDoId === toDoObject.toDoId);
    app.toDoItems = app.toDoItems.filter(elem => elem.toDoId !== toDoObject.toDoId);

    app.removedItemsTimeLog.push(toDoObject, getCurrentDate());
    console.log("Elimin un item din localStorage");
    window.localStorage.removeItem(id);
}

function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    let toDoObject = { toDoId: id, contentText: toBeEdited.textContent };
    const indexToBeEdited = (app.toDoItems).findIndex(elem => elem.toDoId === toDoObject.toDoId);
    if (toDoObject.contentText) {
        app.toDoItems.splice(indexToBeEdited, 1, toDoObject);
        console.log("Editez un item  din localStorage");
        window.localStorage.setItem(document.getElementById(id).parentNode.id, toDoObject.contentText);
        return;
    }
    console.log("Elimin un item din localStorage");
    window.localStorage.removeItem(document.getElementById(id).parentNode.id);
    deleteToDoItem(document.getElementById(id).parentNode.id);
}

function getCurrentDate() {
    let date = new Date();
    return date.toLocaleString();
}

function onLoad(caller) {
    app.numberOfToDoItems = 0;
    let myStorage = getMyStorage();
    if (caller === 'storageEventListener') {
        myStorage.forEach(element => addItemsOnUpdate(element));
    }
    else {
        myStorage.forEach(element => addToDoItem(element));
    }
}

function getMyStorage() {

    let values = [];
    let keys = Object.keys(localStorage);
    let keyNumbers = [];
    keys.forEach(key => keyNumbers.push(parseInt(key.slice(8))));
    keyNumbers.sort(function (a, b) {
        return a - b;
    });
    keyNumbers.forEach(k => values.push(localStorage.getItem(`toDoItem${k}`)));
    console.log(values);
    return values;
}

function popElements(parentId) {
    let toDoItems = document.querySelectorAll('#toDoList > .toDoItem');
    toDoItems.forEach(element => element.parentNode.removeChild(element));
}