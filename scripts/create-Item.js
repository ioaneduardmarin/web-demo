const globalState = require('./global-State.js');
const pageInputUtils = require('./page-Input-Utils.js');
const syncPageUtils = require('./sync-Page-Utils.js');

//Represents the whole process undertaken to add an item and adapt the page according to its addition
function addNewToDoItem() {
    if (!getToDoTextBoxText()) {
        return;
    }

    addToDoItemDivToParentElement(getToDoTextBoxText());
    pageInputUtils.setTextIfNoToDoItems();
    window.toastr["success"]("Item succesfully added!", "Success!");
}

//Add new ToDoItem div element
function addToDoItemDivToParentElement(toDoItemText) {
    //Determines the idNumber of the last entered item to determine what Ids will the div element and its children element will have
    globalState.app.idOfLastEnteredToDoItem++;

    //Creates new div element
    const newEntry = createToDoItem(globalState.app.idOfLastEnteredToDoItem, toDoItemText, 'unchecked', "xyz-in");
    pageInputUtils.setToDoTextBoxText();

    //Updates the idNumber of the last entered item
    window.localStorage.setItem('numberOfItems', globalState.app.idOfLastEnteredToDoItem);

    //Appends important element data to local storage
    let toDoObject = { toDoId: newEntry.id, contentText: newEntry.children[1].textContent, toDoCheckBoxValue: 'unchecked', checkingOrderNumber: null };
    window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
    globalState.app.toDoItems.push(toDoObject);
    globalState.app.toDoItems = syncPageUtils.getMyStorage();
}

//Creates new div element
function createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue) {
    const list = window.document.getElementById('toDoList');
    let alertClass = '';

    if (checkBoxValue === 'unchecked') {
        checkBoxValue = false;
    } else {
        checkBoxValue = true;
    }

    //Creates the div element and its children elements
    const toDoItemDivCheckBox = prepareCheckbox(idNumber, checkBoxValue);
    const toDoItemDivSpan = prepareToDoItemSpan(toDoItemText, idNumber);
    const divRemovalButton = prepareToDoItemRemovalButton(idNumber);

    if (toDoItemDivCheckBox.children[0].checked) {
        alertClass = 'alert-secondary';
    } else {
        alertClass = 'alert-success';
    }
    const newEntry = prepareToDoItem(idNumber, alertClass, animationValue);

    //Appends children elements to parent div elements
    newEntry.appendChild(toDoItemDivCheckBox);
    newEntry.appendChild(toDoItemDivSpan);
    newEntry.appendChild(divRemovalButton);

    //Appends div element to its parent div element and updates the page
    list.prepend(newEntry);

    return newEntry;
}

//Creates the div element
function prepareToDoItem(id, alertClass, animationValue) {
    const newEntry = window.document.createElement('div');
    newEntry.classList = `alert ${alertClass} row rounded toDoItem ${animationValue}`;
    newEntry.id = `toDoItem${id}`;
    return newEntry;
}

//Creates the span child element of the div element
function prepareToDoItemSpan(toDoItemText, idNumber) {
    const divSpan = window.document.createElement('div');
    divSpan.classList = 'col-sm-10';

    const span = window.document.createElement('span');
    span.classList = 'toDoItemText';
    span.id = `toDoItemSpan${idNumber}`;
    span.textContent = toDoItemText;
    span.contentEditable = true;
    span.spellcheck = false;

    divSpan.appendChild(span);
    return divSpan;
}

//Creates the button child element of the div element
function prepareToDoItemRemovalButton(idNumber) {
    const divButton = window.document.createElement('div');
    divButton.classList = 'col-sm-1 removalButton';

    const button = window.document.createElement('button');
    button.classList = 'alertButton close rounded';
    button.id = `addAlertButton${idNumber}`;
    button.innerHTML = '<span aria-hidden="true">&times;</span>';
    button.role = 'button';

    divButton.appendChild(button);
    return divButton;
}

//Create the checkbox child element of the div element
function prepareCheckbox(idNumber, checkBoxValue) {
    const divCheckbox = window.document.createElement('div');
    divCheckbox.classList = 'col-sm-1 custom-control custom-checkbox';

    const checkBox = window.document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.classList = 'custom-control-input checkBox';
    checkBox.id = `toDoCheckBox${idNumber}`;
    checkBox.checked = checkBoxValue;

    const checkBoxLabel = window.document.createElement('label');
    checkBoxLabel.classList = 'custom-control-label';
    checkBoxLabel.for = `checkBox${idNumber}`;

    divCheckbox.appendChild(checkBox);
    divCheckbox.appendChild(checkBoxLabel);
    return divCheckbox;
}

module.exports = {
    addNewToDoItem: addNewToDoItem,
    createToDoItem: createToDoItem
}