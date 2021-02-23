const setToastrOptions = require('./my-Toastr.js');
const utils = require('./utils.js');
const syncPage = require('./sync-Page.js');
const syncPageUtils = require('./sync-Page-Utils.js');
const pageInputUtils = require('./page-Input-Utils.js');
const createItem = require('./create-Item');

//Update page first load
syncPageUtils.getSyncData();
setToastrOptions();
syncPage.onUpdate('', '');
pageInputUtils.setTextIfNoToDoItems();

$('#addTodoButton').click(function () {
    createItem.addNewToDoItem();
});

$('#inputForm').submit(function (event) {
    event.preventDefault();
    createItem.addNewToDoItem();
});

//Updates the page when the local storage is modified
window.addEventListener('storage', (e) => {
    syncPage.onUpdate('localStorageArgs', '');
    pageInputUtils.setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    pageInputUtils.setToDoTextBoxText();
});

//Commit changes after the element loses focus
window.document.querySelectorAll('.toDoItemText').forEach(item => {
    item.addEventListener('blur',
        function (event) {
            event.preventDefault();
            utils.editToDoItem(item.id);
            pageInputUtils.setTextIfNoToDoItems();
        });
});

//Delete div element after button is clicked
window.document.querySelectorAll('.removalButton').forEach(item => {
    item.addEventListener('click',
        function (event) {
            event.preventDefault();
            utils.deleteToDoItem(item.parentNode.id);
            pageInputUtils.setTextIfNoToDoItems();
        });
});

//Changes the parent elements' classlist according to the state of the checkbox
window.document.querySelectorAll('.checkBox').forEach(item => {
    item.addEventListener('change',
        function () {
            if (this.checked) {
                utils.editToDoItem(item.id);
            } else {
                utils.editToDoItem(item.id);
            }
        });
});