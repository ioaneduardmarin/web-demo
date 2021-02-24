const pageInputUtils = require('./page-Input-Utils.js');
const syncPage = require('./sync-Page.js');
const myToastr = require('./my-Toastr.js');
const utils = require('./utils.js');

//Update page first load
syncPage.getSyncData();
myToastr.setToastrOptions();
utils.onUpdate('');
pageInputUtils.setTextIfNoToDoItems();

$('#addTodoButton').click(function () {
    utils.addNewToDoItem();
});

$('#inputForm').submit(function (event) {
    event.preventDefault();
    utils.addNewToDoItem();
});

//Updates the page when the local storage is modified
window.addEventListener('storage', (e) => {
    utils.onUpdate('localStorageArgs', '');
    syncPage.getSyncData();
    pageInputUtils.setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    pageInputUtils.setToDoTextBoxText();
});