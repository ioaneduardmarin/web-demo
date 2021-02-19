// JavaScript source code
const app = {
    idOfLastEnteredToDoItem: 0,
    orderNumberOfLastCheckedItem: 0
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

    window.localStorage.setItem('idOfLastModifiedItem', id);
    onUpdate('xyz-out');
    setTimeout(function () {
        document.querySelector('#toDoList').removeChild(document.getElementById(`${id}`));
        window.localStorage.removeItem(id);
        toastr["success"]("Item succesfully deleted!", "Success!");
        setTextIfNoToDoItems();
    }, 300);
}

//Edits the span item found with the given id or deletes its parent if span element is empty after edit
function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    const localStorageObject = JSON.parse(localStorage.getItem(`toDoItem${id.substr(12)}`));
    let toDoObject = {};

    if (toBeEdited.tagName == 'SPAN') {
        if (toBeEdited.textContent) {
            toDoObject = {
                toDoId: `toDoItem${id.substr(12)}`,
                contentText: toBeEdited.textContent,
                toDoCheckBoxValue: localStorageObject.toDoCheckBoxValue,
                checkingOrderNumber: localStorageObject.checkingOrderNumber
            };
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            return;
        }
        deleteToDoItem(toDoObject.toDoId);
        return;
    }

    if (toBeEdited.checked) {
        app.orderNumberOfLastCheckedItem++;
        toDoObject = {
            toDoId: `toDoItem${id.substr(12)}`,
            contentText: localStorageObject.contentText,
            toDoCheckBoxValue: 'checked',
            checkingOrderNumber: app.orderNumberOfLastCheckedItem
        };
        window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
        onUpdate('xyz-out');
        setTimeout(function () {
            window.localStorage.setItem('numberOfPrioritizedItems', app.orderNumberOfLastCheckedItem);
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            onUpdate('xyz-in');
        },
            200);
        return;
    }

    toDoObject = {
        toDoId: `toDoItem${id.substr(12)}`,
        contentText: localStorageObject.contentText,
        toDoCheckBoxValue: 'unchecked',
        checkingOrderNumber: null
    };
    window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
    onUpdate('xyz-out');
    setTimeout(function () {
        window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
        onUpdate('xyz-in');
    },
        200);
}