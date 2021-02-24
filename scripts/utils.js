// JavaScript source code
const app = {
    idOfLastEnteredToDoItem: 0,
    orderNumberOfLastCheckedItem: 0,
    toDoItems: [],
    idOfLastModifiedItem: ''
};

//Represents the whole process undertaken to add an item and adapt the page according to its addition
function addNewToDoItem() {
    if (!getToDoTextBoxText()) {
        return;
    }

    addToDoItemDivToParentElement(getToDoTextBoxText());
    setTextIfNoToDoItems();
    toastr["success"]("Item succesfully added!", "Success!");
}

//Add new ToDoItem div element
function addToDoItemDivToParentElement(toDoItemText) {
    //Determines the idNumber of the last entered item to determine what Ids will the div element and its children element will have
    app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems');
    app.idOfLastEnteredToDoItem++;

    //Creates new div element
    const newEntry = createToDoItem(app.idOfLastEnteredToDoItem, toDoItemText, 'unchecked', "xyz-in");

    //Updates the idNumber of the last entered item
    window.localStorage.setItem('numberOfItems', app.idOfLastEnteredToDoItem);

    //Appends important element data to local storage
    let toDoObject = { toDoId: newEntry.id, contentText: newEntry.children[1].textContent, toDoCheckBoxValue: 'unchecked', checkingOrderNumber: null };
    window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
    app.toDoItems.push(toDoObject);
    app.toDoItems = getMyStorage();
}

//Gets text from input element
function getToDoTextBoxText() {
    return document.querySelector('#addTodoTextBox').value;
}

//Resets input text content state to empty
function setToDoTextBoxText() {
    document.querySelector('#addTodoTextBox').value = '';
}

//Sets the visibility state of the element with id equal to 'noToDoItemInfo'
function setTextIfNoToDoItems() {
    document.querySelector('#noToDoItemInfo').hidden = doTodoItemsExist();
}

//Checks if the parent div element has children elemens
function doTodoItemsExist() {
    let number = document.querySelector('#toDoList').childElementCount;
    if (parseInt(number) > 0) {
        return true;
    }
    return false;
}

//Deletes the item found with the given id
function deleteToDoItem(id) {
    let toBeDeleted = document.getElementById(id);
    if (!toBeDeleted) {
        return;
    }

    app.idOfLastModifiedItem = id;
    window.localStorage.setItem('idOfLastModifiedItem', id);

    document.getElementById(id).classList.remove('xyz-in');
    document.getElementById(id).classList.add('xyz-out');

    setTimeout(function () {
        document.querySelector('#toDoList').removeChild(document.getElementById(`${id}`));
        window.localStorage.removeItem(id);
        app.toDoItems = app.toDoItems.filter(object => object.toDoId !== id);
        toastr["success"]("Item succesfully deleted!", "Success!");
        setTextIfNoToDoItems();
    }, 300);
}

//Edits the span item found with the given id or deletes its parent if span element is empty after edit
function editToDoItemSpan(id) {
    let toBeEdited = document.getElementById(id);
    const localStorageObject = app.toDoItems.filter(object => object.toDoId === `toDoItem${id.substr(12)}`)[0];
    const localStorageObjectIndex = app.toDoItems.findIndex(object => object.toDoId === localStorageObject.toDoId);
    let toDoObject = {};

    if (toBeEdited.textContent) {
        toDoObject = {
            toDoId: `toDoItem${id.substr(12)}`,
            contentText: toBeEdited.textContent,
            toDoCheckBoxValue: localStorageObject.toDoCheckBoxValue,
            checkingOrderNumber: localStorageObject.checkingOrderNumber
        };
        window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
        app.toDoItems[localStorageObjectIndex] = toDoObject;
        return;
    }
    deleteToDoItem(toDoObject.toDoId);
    app.toDoItems = app.toDoItems.filter(object => object.toDoId !== toDoObject.toDoId);
}

function editToDoItemCheckBox(id) {
    let toBeEdited = document.getElementById(id);
    const localStorageObject = app.toDoItems.filter(object => object.toDoId === `toDoItem${id.substr(12)}`)[0];
    const localStorageObjectIndex = app.toDoItems.findIndex(object => object.toDoId === localStorageObject.toDoId);
    let toDoObject = {};

    if (toBeEdited.checked) {
        app.orderNumberOfLastCheckedItem++;
        toDoObject = {
            toDoId: `toDoItem${id.substr(12)}`,
            contentText: localStorageObject.contentText,
            toDoCheckBoxValue: 'checked',
            checkingOrderNumber: app.orderNumberOfLastCheckedItem
        };
        window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
        app.idOfLastModifiedItem = toDoObject.toDoId;

        document.getElementById(toDoObject.toDoId).classList.remove('xyz-in');
        document.getElementById(toDoObject.toDoId).classList.add('xyz-out');

        setTimeout(function () {
            window.localStorage.setItem('numberOfPrioritizedItems', app.orderNumberOfLastCheckedItem);
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            app.toDoItems[localStorageObjectIndex] = toDoObject;
            onUpdate('', 'xyz-in');
        },
            200);

    } else {
        toDoObject = {
            toDoId: `toDoItem${id.substr(12)}`,
            contentText: localStorageObject.contentText,
            toDoCheckBoxValue: 'unchecked',
            checkingOrderNumber: null
        };
        window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
        app.idOfLastModifiedItem = toDoObject.toDoId;

        document.getElementById(toDoObject.toDoId).classList.remove('xyz-in');
        document.getElementById(toDoObject.toDoId).classList.add('xyz-out');

        setTimeout(function () {
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            app.toDoItems[localStorageObjectIndex] = toDoObject;
            onUpdate('', 'xyz-in');
        },
            200);
    }
}

//Sync Data
function getSyncData() {
    app.toDoItems = getMyStorage('localStorageArgs');
    app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems') === null ? 0 : parseInt(window.localStorage.getItem('numberOfItems'));
    app.orderNumberOfLastCheckedItem = window.localStorage.getItem('numberOfPrioritizedItems') === null ? 0 : parseInt(window.localStorage.getItem('numberOfPrioritizedItems'));
    app.idOfLastModifiedItem = window.localStorage.getItem('idOfLastModifiedItem') === null ? '' : window.localStorage.getItem('idOfLastModifiedItem');
}