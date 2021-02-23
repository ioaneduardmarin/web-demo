const createItem = require('./create-Item.js');
const globalState = require('./global-State.js');
const syncPageUtils = require('./sync-Page-Utils.js');
const pageInputUtils = require('./page-Input-Utils.js');

//Updates the list of div elements
function onUpdate(args, animationClass) {
    pageInputUtils.popElements();
    globalState.app.toDoItems = syncPageUtils.getMyStorage(args);
    globalState.app.toDoItems.forEach(element => addUpdatedToDoItems(element.toDoId, element.contentText, element.toDoCheckBoxValue, element.toDoId === globalState.app.idOfLastModifiedItem ? `${animationClass}` : ''));
}

//Creates div and its children elements and adds them to the parent div element(used when the page is refreshed and when the local storage was modified)
function addUpdatedToDoItems(toDoItemId, toDoItemText, checkBoxValue, animationValue) {
    const idNumber = parseInt(toDoItemId.slice(8));
    globalState.app.idOfLastEnteredToDoItem = idNumber;
    createItem.createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue);
}

module.exports =
{
    onUpdate: onUpdate
}