// JavaScript source code
const app = {
    numberOfToDoItems: 0,
    toDoItems: []
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
    app.numberOfToDoItems = window.localStorage.getItem('numberOfItems');
    app.numberOfToDoItems++;
    if (!toDoItemText) {
        return;
    }

    let list = document.getElementById('toDoList');
    let newEntry = prepareToDoItem();
    let toDoItemSpan = prepareToDoItemSpan(toDoItemText);
    let removalAnchor = prepareToDoItemRemovalAnchor();
    window.localStorage.setItem('numberOfItems', app.numberOfToDoItems);

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

    console.log(`Adaug un item nou in localStorage ${toDoObject.toDoId} ${toDoObject.contentText}`);
    console.log(app.numberOfToDoItems);
    window.localStorage.setItem(toDoObject.toDoId, toDoObject.contentText);
}

function addUpdatedToDoItems(toDoItemId, toDoItemText) {
    console.log(`Adaug doar in ul al noului tabel elementul ${toDoItemId} ${toDoItemText}`);
    let list = document.getElementById('toDoList');
    let newEntry = prepareToDoItem();
    newEntry.id = toDoItemId;
    let toDoItemSpan = prepareToDoItemSpan(toDoItemText);
    let removalAnchor = prepareToDoItemRemovalAnchor();
    app.numberOfToDoItems++;

    newEntry.appendChild(toDoItemSpan);
    newEntry.appendChild(removalAnchor);

    toDoItemSpan.addEventListener('blur',
        function (event) {
            editToDoItem(toDoItemSpan.id);
            event.preventDefault();
            setTextIfNoToDoItems();
        });

    removalAnchor.addEventListener('click',
        function (event) {
            deleteToDoItem(newEntry.id);
            event.preventDefault();
            setTextIfNoToDoItems();
        });

    list.appendChild(newEntry);
    setToDoTextBoxText();
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
    console.log(localStorage);
    let toBeDeleted = document.getElementById(id);
    if (!toBeDeleted) {
        return;
    }

    let toDoObject = { toDoId: id, contentText: toBeDeleted.firstChild.textContent };
    console.log(`Elimin un item din localStorage ${toDoObject.toDoId} ${toDoObject.contentText}`);
    toBeDeleted.parentNode.removeChild(toBeDeleted);
    window.localStorage.removeItem(id);
    console.log(app.numberOfToDoItems);
    console.log(localStorage);
}

function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    let toDoObject = { toDoId: id, contentText: toBeEdited.textContent };
    if (toDoObject.contentText) {
        console.log(`Editez un item  din localStorage ${toDoObject.toDoId} ${toDoObject.contentText}`);
        window.localStorage.setItem(document.getElementById(id).parentNode.id, toDoObject.contentText);
        console.log(app.numberOfToDoItems);
        return;
    }
    console.log(`Elimin un item din localStorage ${toDoObject.toDoId} ${toDoObject.contentText}`);
    window.localStorage.removeItem(document.getElementById(id).parentNode.id);
    deleteToDoItem(document.getElementById(id).parentNode.id);
    console.log(app.numberOfToDoItems);
}

function getCurrentDate() {
    let date = new Date();
    return date.toLocaleString();
}

function onLoad() {
    app.numberOfToDoItems = 0;
    const myStorage = getMyStorage();
    myStorage.forEach(element => addToDoItem(element));
}

function getMyStorage() {

    const toDoObjects = [];
    console.log("Obtin cheile itemilor din localStorage");
    let keys = Object.keys(localStorage);
    keys = keys.filter(key => key.includes('toDoItem'));
    const keyNumbers = [];
    keys.forEach(key => keyNumbers.push(parseInt(key.slice(8))));
    keyNumbers.sort(function (a, b) {
        return a - b;
    });
    console.log("Adaug in vectorul values valorile itemilor din localStorage folosind cheile extrase anterior");
    keyNumbers.forEach(k => {
        let toDoObject = {
            toDoId: `toDoItem${k}`,
            contentText: localStorage.getItem(`toDoItem${k}`)
        };
        toDoObjects.push(toDoObject);
    });
    return toDoObjects;
}

function onUpdate() {
    console.log(app.numberOfToDoItems);
    popElements();
    const myStorage = getMyStorage();
    myStorage.forEach(element => addUpdatedToDoItems(element.toDoId, element.contentText));
    app.numberOfToDoItems = window.localStorage.getItem('numberOfItems');
}

function popElements() {
    let toDoItems = document.querySelectorAll('#toDoList > .toDoItem');
    toDoItems.forEach(element => element.parentNode.removeChild(element));
}