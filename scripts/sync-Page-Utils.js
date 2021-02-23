// JavaScript source code
const globalState = require('./global-State.js');

//Gets the objects that contain important data of the existing div elements from local storage
function getMyStorage(args) {
    const keyNumbers = [];

    if (args === 'localStorageArgs') {
        //Extracts keys of the local storage objects and orders them
        let keys = Object.keys(window.localStorage);
        keys = keys.filter(key => key.includes('toDoItem'));
        keys.forEach(key => keyNumbers.push(parseInt(key.slice(8))));
        keyNumbers.sort(function (a, b) {
            return a - b;
        });
    } else {
        let objects = globalState.app.toDoItems;
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
            toDoObject = JSON.parse(window.localStorage.getItem(`toDoItem${k}`));
        } else {
            toDoObject = globalState.app.toDoItems.filter(object => object.toDoId === `toDoItem${k}`)[0];
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

//Sync Data
function getSyncData() {
    globalState.app.toDoItems = getMyStorage('localStorageArgs');
    globalState.app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems') === null ? 0 : parseInt(window.localStorage.getItem('numberOfItems'));
    globalState.app.orderNumberOfLastCheckedItem = window.localStorage.getItem('numberOfPrioritizedItems') === null ? 0 : parseInt(window.localStorage.getItem('numberOfPrioritizedItems'));
    globalState.app.idOfLastModifiedItem = window.localStorage.getItem('idOfLastModifiedItem') === null ? '' : window.localStorage.getItem('idOfLastModifiedItem');
}

module.exports= {
    getMyStorage: getMyStorage,
    getSyncData: getSyncData
}