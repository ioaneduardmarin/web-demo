// JavaScript source code
const app = {
    idOfLastEnteredToDoItem: 0,
    toDoItems: []
};

//Add new div elements
function addToDoItem(toDoItemText) {
    //Determines the idNumber of the last entered item to determine what Ids will the div element and its children element will have
    app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems');
    app.idOfLastEnteredToDoItem++;

    //Stops action if text is nullOrEmpty
    if (!toDoItemText) {
        return;
    }

    let list = document.getElementById('toDoList');

    //Creates the div element and its children elements
    let newEntry = prepareToDoItem(app.idOfLastEnteredToDoItem);
    let toDoItemDivSpan = prepareToDoItemSpan(toDoItemText, parseInt((newEntry.id).slice(8)));
    let removalButton = prepareToDoItemRemovalButton(parseInt((newEntry.id).slice(8)));

    //Updates the idNumber of the last entered item
    window.localStorage.setItem('numberOfItems', parseInt((newEntry.id).slice(8)));

    //Appends children elements to parent div elements
    newEntry.appendChild(toDoItemDivSpan);
    newEntry.appendChild(removalButton);

    //Commit changes after the element loses focus
    toDoItemDivSpan.firstChild.addEventListener('blur', function (event) {
        event.preventDefault();
        editToDoItem(toDoItemDivSpan.firstChild.id);
        setTextIfNoToDoItems();
    });

    //Delete div element after button is clicked
    removalButton.addEventListener('click', function (event) {
        event.preventDefault();
        deleteToDoItem(newEntry.id);
        setTextIfNoToDoItems();
    });


    //Appends div element to its parent div element and updates the page
    list.appendChild(newEntry);
    setToDoTextBoxText();

    //Appends important element data to local storage
    let toDoObject = { toDoId: newEntry.id, contentText: toDoItemDivSpan.textContent };
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

//Creates the div element
function prepareToDoItem(id) {
    let newEntry = document.createElement('div');
    newEntry.classList = 'alert alert-success row rounded';
    newEntry.id = `toDoItem${id}`;
    return newEntry;
}

//Creates the span child element of the div element
function prepareToDoItemSpan(toDoItemText, idNumber) {
    let divSpan = document.createElement('div');
    divSpan.classList = 'col-sm-11';
    let span = document.createElement('span');
    span.class = 'toDoItemText';
    span.id = `toDoItemSpan${idNumber}`;
    span.textContent = toDoItemText;
    span.contentEditable = true;
    span.spellcheck = false;
    divSpan.appendChild(span);
    return divSpan;
}

//Creates the button child element of the div element
function prepareToDoItemRemovalButton(idNumber) {
    let divButton = document.createElement('div');
    divButton.classList = 'col-sm-1 g-1';
    let button = document.createElement('button');
    button.classList = 'alertButton rounded';
    button.id = `addAlertButton${idNumber}`;
    button.innerHTML = '<span aria-hidden="true">&times;</span>';
    button.role = 'button';
    divButton.appendChild(button);
    return divButton;
}

//Deletes the item found with the given id
function deleteToDoItem(id) {
    let toBeDeleted = document.getElementById(id);
    if (!toBeDeleted) {
        return;
    }

    let toDoObject = { toDoId: id, contentText: toBeDeleted.firstChild.textContent };
    toBeDeleted.parentNode.removeChild(toBeDeleted);
    window.localStorage.removeItem(id);
}

//Edits the span item found with the given id or deletes its parent if span element is empty after edit
function editToDoItem(id) {
    let toBeEdited = document.getElementById(id);
    let toDoObject = { toDoId: id, contentText: toBeEdited.textContent };
    if (toDoObject.contentText) {
        window.localStorage.setItem(document.getElementById(id).parentNode.parentNode.id, toDoObject.contentText);
        return;
    }
    window.localStorage.removeItem(document.getElementById(id).parentNode.parentNode.id);
    deleteToDoItem(document.getElementById(id).parentNode.parentNode.id);
}

//Updates the list of div elements
function onUpdate() {
    popElements();
    const myStorage = getMyStorage();
    myStorage.forEach(element => addUpdatedToDoItems(element.toDoId, element.contentText));
}

//Deletes al div elements
function popElements() {
    let toDoItems = document.querySelectorAll('#toDoList > .toDoItem');
    toDoItems.forEach(element => element.parentNode.removeChild(element));
}


//Gets the objects that contain important data of the existing div elements from local storage
function getMyStorage() {


    //Extracts keys of the local storage objects and orders them 
    let keys = Object.keys(localStorage);
    keys = keys.filter(key => key.includes('toDoItem'));
    const keyNumbers = [];
    keys.forEach(key => keyNumbers.push(parseInt(key.slice(8))));
    keyNumbers.sort(function (a, b) {
        return a - b;
    });

    //Fills the toDoObject array with the sorted local storage objects that contain important data of the existing div elements
    const toDoObjects = [];
    keyNumbers.forEach(k => {
        let toDoObject = {
            toDoId: `toDoItem${k}`,
            contentText: localStorage.getItem(`toDoItem${k}`)
        };
        toDoObjects.push(toDoObject);
    });
    return toDoObjects;
}

//Creates div and its children elements and adds them to the parent div element(used when the page is refreshed and when the local storage was modified)
function addUpdatedToDoItems(toDoItemId, toDoItemText) {
    const idNumber = parseInt(toDoItemId.slice(8));
    app.idOfLastEnteredToDoItem = idNumber;
    let list = document.getElementById('toDoList');

    //Creates the div element and its children elements
    let newEntry = prepareToDoItem(idNumber);
    let toDoItemDivSpan = prepareToDoItemSpan(toDoItemText, idNumber);
    let removalButton = prepareToDoItemRemovalButton(idNumber);

    //Appends children elements to parent div elements
    newEntry.appendChild(toDoItemDivSpan);
    newEntry.appendChild(removalButton);

    //Commit changes after the element loses focus
    toDoItemDivSpan.firstChild.addEventListener('blur',
        function (event) {
            event.preventDefault();
            editToDoItem(toDoItemDivSpan.firstChild.id);
            setTextIfNoToDoItems();
        });

    //Delete div element after button is clicked
    removalButton.addEventListener('click',
        function (event) {
            event.preventDefault();
            deleteToDoItem(newEntry.id);
            setTextIfNoToDoItems();
        });

    //Appends div element to its parent div element and updates the page
    list.appendChild(newEntry);
    setToDoTextBoxText();
}