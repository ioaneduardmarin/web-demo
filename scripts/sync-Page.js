//Updates the list of div elements
function onUpdate(animationClass) {
    popElements();
    const myStorage = getMyStorage();
    myStorage.forEach(element => addUpdatedToDoItems(element.toDoId, element.contentText, element.toDoCheckBoxValue, element.toDoId === localStorage.getItem('idOfLastModifiedItem') ? `${animationClass}` : ''));
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
    let priorityToDoObjects = [];
    keyNumbers.forEach(k => {
        let toDoObject = JSON.parse(localStorage.getItem(`toDoItem${k}`));
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