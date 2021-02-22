//Updates the list of div elements
function onUpdate(args, animationClass) {
    popElements();
    app.toDoItems = getMyStorage(args);
    app.toDoItems.forEach(element => addUpdatedToDoItems(element.toDoId, element.contentText, element.toDoCheckBoxValue, element.toDoId === app.idOfLastModifiedItem ? `${animationClass}` : ''));
}

//Deletes al div elements
function popElements() {
    let toDoItems = document.querySelectorAll('#toDoList > .toDoItem');
    toDoItems.forEach(element => element.parentNode.removeChild(element));
}

//Gets the objects that contain important data of the existing div elements from local storage
function getMyStorage(args) {
    const keyNumbers = [];

    if (args === 'localStorageArgs') {
        //Extracts keys of the local storage objects and orders them
        let keys = Object.keys(localStorage);
        keys = keys.filter(key => key.includes('toDoItem'));
        keys.forEach(key => keyNumbers.push(parseInt(key.slice(8))));
        keyNumbers.sort(function (a, b) {
            return a - b;
        });
    } else {
        let objects = app.toDoItems;
        objects.forEach(object => keyNumbers.push(parseInt(object.toDoId.slice(8))));
        keyNumbers.sort(function (a, b) {
            return a - b;
        });
    }

    //Fills the toDoObject array with the sorted local storage objects that contain important data of the existing div elements
    const toDoObjects = [];
    let toDoObject;
    let priorityToDoObjects = [];
    keyNumbers.forEach(k => {

        if (args === 'localStorageArgs') {
            toDoObject = JSON.parse(localStorage.getItem(`toDoItem${k}`));
        } else {
            toDoObject = app.toDoItems.filter(object => object.toDoId === `toDoItem${k}`)[0];
        }

        if (toDoObject.checkingOrderNumber !== null) {
            priorityToDoObjects.push(toDoObject);
        }
        else {
            toDoObjects.push(toDoObject);
        }

        priorityToDoObjects =
            priorityToDoObjects.sort((a, b) => parseInt(a.checkingOrderNumber) - parseInt(b.checkingOrderNumber));
    });
    return priorityToDoObjects.concat(toDoObjects);
}

//Creates div and its children elements and adds them to the parent div element(used when the page is refreshed and when the local storage was modified)
function addUpdatedToDoItems(toDoItemId, toDoItemText, checkBoxValue, animationValue) {
    const idNumber = parseInt(toDoItemId.slice(8));
    app.idOfLastEnteredToDoItem = idNumber;
    createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue);
}