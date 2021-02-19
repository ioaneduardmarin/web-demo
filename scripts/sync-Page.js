//Updates the list of div elements
function onUpdate(toDoItems ,animationClass) {
    popElements();
    const myStorage = toDoItems;
    myStorage.forEach(element => {
        //console.log(element);
        addUpdatedToDoItems(element.toDoId,
            element.contentText,
            element.toDoCheckBoxValue,
            element.toDoId === localStorage.getItem('idOfLastModifiedItem') ? `${animationClass}` : '')
    });
}

//Deletes al div elements
function popElements() {
    let toDoItems = document.querySelectorAll('#toDoList > .toDoItem');
    toDoItems.forEach(element => element.parentNode.removeChild(element));
}

//Creates div and its children elements and adds them to the parent div element(used when the page is refreshed and when the local storage was modified)
function addUpdatedToDoItems(toDoItemId, toDoItemText, checkBoxValue, animationValue) {
    const idNumber = parseInt(toDoItemId.slice(8));
    createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue);
}