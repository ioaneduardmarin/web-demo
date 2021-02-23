const syncPage = require('./sync-Page.js');
const globalState = require('./global-State.js');
const pageInputUtils= require('./page-Input-Utils.js')

//Deletes the item found with the given id
function deleteToDoItem(id) {
    let toBeDeleted = window.document.getElementById(id);
    if (!toBeDeleted) {
        return;
    }

    globalState.app.idOfLastModifiedItem = id;
    window.localStorage.setItem('idOfLastModifiedItem', id);
    syncPage.onUpdate('', 'xyz-out');
    setTimeout(function () {
        window.document.querySelector('#toDoList').removeChild(window.document.getElementById(`${id}`));
        window.localStorage.removeItem(id);
        globalState.app.toDoItems = globalState.app.toDoItems.filter(object => object.toDoId !== id);
        window.toastr["success"]("Item succesfully deleted!", "Success!");
        pageInputUtils.setTextIfNoToDoItems();
    }, 300);
}

//Edits the span item found with the given id or deletes its parent if span element is empty after edit
function editToDoItem(id) {
    let toBeEdited = window.document.getElementById(id);
    const localStorageObject = globalState.app.toDoItems.filter(object => object.toDoId === `toDoItem${id.substr(12)}`)[0];
    const localStorageObjectIndex = globalState.app.toDoItems.findIndex(object => object.toDoId === localStorageObject.toDoId);
    let toDoObject = {};

    if (toBeEdited.tagName === 'SPAN') {
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
        deleteToDoItem(toDoObject.toDoId);
        globalState.app.toDoItems = globalState.app.toDoItems.filter(object => object.toDoId !== toDoObject.toDoId);
        pageInputUtils.setTextIfNoToDoItems();
        return;
    }

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
        syncPage.onUpdate('', 'xyz-out');
        setTimeout(function () {
            window.localStorage.setItem('numberOfPrioritizedItems', globalState.app.orderNumberOfLastCheckedItem);
            window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
            globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
            syncPage.onUpdate('', 'xyz-in');
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
    globalState.app.idOfLastModifiedItem = toDoObject.toDoId;
    syncPage.onUpdate('', 'xyz-out');
    setTimeout(function () {
        window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
        globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
        syncPage.onUpdate('', 'xyz-in');
    },
        200);
}

module.exports = {
    deleteToDoItem: deleteToDoItem,
    editToDoItem: editToDoItem
}