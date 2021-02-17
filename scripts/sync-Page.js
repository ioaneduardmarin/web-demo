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
    createToDoItem(idNumber, toDoItemText);
}