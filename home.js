//JavaScript source code

//Update page first load
onUpdate();
setTextIfNoToDoItems();

$('#addTodoButton').click(function () {
    if (!getToDoTextBoxText()) {
        return;
    }

    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000000",
        "hideDuration": "1000000",
        "timeOut": "1000000",
        "extendedTimeOut": "1000000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    toastr["success"]("Item succesfully added!", "Success!");
});

$('#inputForm').submit(function (event) {
    event.preventDefault();
    if (!getToDoTextBoxText()) {
        return;
    }

    addToDoItem(getToDoTextBoxText());
    setTextIfNoToDoItems();

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    toastr["success"]("Item succesfully added!", "Success!");
});


//Updates the page when the local storage is modified
window.addEventListener('storage', (e) => {
    console.log('Declansez operatia de sincronizare a itemilor toDo intre tabele');
    onUpdate();
    setTextIfNoToDoItems();
});

//Updates the page on load
window.addEventListener('load', () => {
    setToDoTextBoxText();
});