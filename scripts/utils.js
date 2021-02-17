// JavaScript source code
const app = {
    idOfLastEnteredToDoItem: 0,
    toDoItems: []
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
    const newEntry = createToDoItem(app.idOfLastEnteredToDoItem, toDoItemText);

    //Updates the idNumber of the last entered item
    window.localStorage.setItem('numberOfItems', app.idOfLastEnteredToDoItem);

    //Appends important element data to local storage
    let toDoObject = { toDoId: newEntry.id, contentText: newEntry.firstChild.textContent };
    window.localStorage.setItem(toDoObject.toDoId, toDoObject.contentText);
}

//Gets text from input element
function getToDoTextBoxText() {
    return document.getElementById('addTodoTextBox').value;
}

//Resets input text content state to empty
function setToDoTextBoxText() {
    document.getElementById('addTodoTextBox').value = '';
}

//Sets the visibility state of the element with id equal to 'noToDoItemInfo'
function setTextIfNoToDoItems() {
    document.getElementById('noToDoItemInfo').hidden = doTodoItemsExist();
}

//Checks if the parent div element has children elemens
function doTodoItemsExist() {
    let number = document.getElementById('toDoList').childElementCount;
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

    toBeDeleted.parentNode.removeChild(toBeDeleted);
    window.localStorage.removeItem(id);
    toastr["success"]("Item succesfully deleted!", "Success!");
}

//Edits the span item found with the given id or deletes its parent if span element is empty after edit
function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    if (toBeEdited.textContent) {
        window.localStorage.setItem(document.getElementById(id).parentNode.parentNode.id, toBeEdited.textContent);
        return;
    }
    deleteToDoItem(document.getElementById(id).parentNode.parentNode.id);
}