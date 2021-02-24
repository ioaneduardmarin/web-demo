const globalState = require('./global-State.js');
const pageInputUtils = require('./page-Input-Utils.js');
const syncPage = require('./sync-Page.js');
const createItem = require('./create-Item.js');

//Updates the list of div elements
function onUpdate(args, animationClass) {
    syncPage.popElements();
    globalState.app.toDoItems = syncPage.getMyStorage(args);
    globalState.app.toDoItems.forEach(element => addToDoItemOnUpdate(element.toDoId, element.contentText, element.toDoCheckBoxValue, element.toDoId === globalState.app.idOfLastModifiedItem ? `${animationClass}` : ''));
}

//Creates div and its children elements and adds them to the parent div element(used when the page is refreshed and when the local storage was modified)
function addToDoItemOnUpdate(toDoItemId, toDoItemText, checkBoxValue, animationValue) {
    const idNumber = parseInt(toDoItemId.slice(8));
    globalState.app.idOfLastEnteredToDoItem = idNumber;
    prependToDoItemToParentElement(idNumber, toDoItemText, checkBoxValue, animationValue);
}

function prependToDoItemToParentElement(idNumber, toDoItemText, checkBoxValue, animationValue) {
    const list = window.document.getElementById('toDoList');

    //Creates new div element
    let newEntry = createItem.createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue);

    //Add event listeners for the 3 child elements of the newEntry
    newEntry = addEventListeners(newEntry);

    //Appends div element to its parent div element and updates the page
    list.prepend(newEntry);

    return newEntry;
}

//Add event listeners for the 3 child elements of the toDoItem
function addEventListeners(toDoItem) {
    //Changes the parent elements' classlist according to the state of the checkbox
    toDoItem.children[0].firstChild.addEventListener('change', function () {
        editToDoItemCheckBox(toDoItem.children[0].firstChild.id);
    });

    //Commit changes after the element loses focus
    toDoItem.children[1].firstChild.addEventListener('blur',
        function (event) {
            event.preventDefault();
            editToDoItemSpan(toDoItem.children[1].firstChild.id);
            pageInputUtils.setTextIfNoToDoItems();
        });

    //Delete div element after button is clicked
    toDoItem.children[2].addEventListener('click',
        function (event) {
            event.preventDefault();
            deleteToDoItem(toDoItem.id);
            pageInputUtils.setTextIfNoToDoItems();
        });

    return toDoItem;
}

//Represents the whole process undertaken to add an item and adapt the page according to its addition
function addNewToDoItem() {
    if (!pageInputUtils.getToDoTextBoxText()) {
        return;
    }
    //Determines the idNumber of the last entered item to determine what Ids will the div element and its children element will have
    globalState.app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems');
    globalState.app.idOfLastEnteredToDoItem++;

    //Add div to parent element
    let newEntry = prependToDoItemToParentElement(globalState.app.idOfLastEnteredToDoItem, pageInputUtils.getToDoTextBoxText(), 'unchecked', "xyz-in");

    //Updates the idNumber of the last entered item
    window.localStorage.setItem('numberOfItems', globalState.app.idOfLastEnteredToDoItem);

    //Appends important element data to local storage
    let toDoObject = { toDoId: newEntry.id, contentText: newEntry.children[1].textContent, toDoCheckBoxValue: 'unchecked', checkingOrderNumber: null };
    window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));

    globalState.app.toDoItems.push(toDoObject);
    globalState.app.toDoItems = syncPage.getMyStorage();

    pageInputUtils.setToDoTextBoxText();
    pageInputUtils.setTextIfNoToDoItems();

    window.toastr["success"]("Item succesfully added!", "Success!");
}

//Deletes the item found with the given id
function deleteToDoItem(id) {
    let toBeDeleted = window.document.getElementById(id);
    if (!toBeDeleted) {
        return;
    }

    globalState.app.idOfLastModifiedItem = id;
    window.localStorage.setItem('idOfLastModifiedItem', id);

    window.document.getElementById(id).classList.remove('xyz-in');
    window.document.getElementById(id).classList.add('xyz-out');

    window.setTimeout(function () {
        window.document.querySelector('#toDoList').removeChild(window.document.getElementById(`${id}`));
        window.localStorage.removeItem(id);
        globalState.app.toDoItems = globalState.app.toDoItems.filter(object => object.toDoId !== id);
        window.toastr["success"]("Item succesfully deleted!", "Success!");
        pageInputUtils.setTextIfNoToDoItems();
    }, 300);
}

//Edits the span item found with the given id or deletes its parent if span element is empty after edit
function editToDoItemSpan(id) {
    let toBeEdited = window.document.getElementById(id);
    const localStorageObject = globalState.app.toDoItems.filter(object => object.toDoId === `toDoItem${id.substr(12)}`)[0];
    const localStorageObjectIndex = globalState.app.toDoItems.findIndex(object => object.toDoId === localStorageObject.toDoId);
    let toDoObject = {};

    if (toBeEdited.textContent) {
        toDoObject = {
            toDoId: `toDoItem${id.substr(12)}`,
            contentText: toBeEdited.textContent,
            toDoCheckBoxValue: localStorageObject.toDoCheckBoxValue,
            checkingOrderNumber: localStorageObject.checkingOrderNumber
        };
        window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
        globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
        return;
    }
    deleteToDoItem(`toDoItem${id.substr(12)}`);
    globalState.app.toDoItems = globalState.app.toDoItems.filter(object => object.toDoId !== toDoObject.toDoId);
}

function editToDoItemCheckBox(id) {
    let toBeEdited = window.document.getElementById(id);
    const localStorageObject = globalState.app.toDoItems.filter(object => object.toDoId === `toDoItem${id.substr(12)}`)[0];
    const localStorageObjectIndex = globalState.app.toDoItems.findIndex(object => object.toDoId === localStorageObject.toDoId);
    let toDoObject = {};

    if (toBeEdited.checked) {
        globalState.app.orderNumberOfLastCheckedItem++;
        toDoObject = {
            toDoId: `toDoItem${id.substr(12)}`,
            contentText: localStorageObject.contentText,
            toDoCheckBoxValue: 'checked',
            checkingOrderNumber: globalState.app.orderNumberOfLastCheckedItem
        };
        window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
        globalState.app.idOfLastModifiedItem = toDoObject.toDoId;

        window.document.getElementById(toDoObject.toDoId).classList.remove('xyz-in');
        window.document.getElementById(toDoObject.toDoId).classList.add('xyz-out');

        window.setTimeout(function () {
            window.localStorage.setItem('numberOfPrioritizedItems', globalState.app.orderNumberOfLastCheckedItem);
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
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
        globalState.app.idOfLastModifiedItem = toDoObject.toDoId;

        window.document.getElementById(toDoObject.toDoId).classList.remove('xyz-in');
        window.document.getElementById(toDoObject.toDoId).classList.add('xyz-out');

        window.setTimeout(function () {
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
            onUpdate('', 'xyz-in');
        },
            200);
    }
}

module.exports= {
    onUpdate: onUpdate,
    addNewToDoItem: addNewToDoItem
}