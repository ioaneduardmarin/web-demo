//Creates new div element
function createToDoItem(idNumber, toDoItemText) {
    let list = document.getElementById('toDoList');

    //Creates the div element and its children elements
    let newEntry = prepareToDoItem(idNumber);
    let toDoItemDivSpan = prepareToDoItemSpan(toDoItemText, idNumber);
    let removalButton = prepareToDoItemRemovalButton(idNumber);

    //Appends children elements to parent div elements
    newEntry.appendChild(toDoItemDivSpan);
    newEntry.appendChild(removalButton);

    //Commit changes after the element loses focus
    toDoItemDivSpan.firstChild.addEventListener('blur',
        function (event) {
            event.preventDefault();
            editToDoItem(toDoItemDivSpan.firstChild.id);
            setTextIfNoToDoItems();
        });

    //Delete div element after button is clicked
    removalButton.addEventListener('click',
        function (event) {
            event.preventDefault();
            deleteToDoItem(newEntry.id);
            setTextIfNoToDoItems();
        });

    //Appends div element to its parent div element and updates the page
    list.appendChild(newEntry);
    setToDoTextBoxText();

    return newEntry;
}

//Creates the div element
function prepareToDoItem(id) {
    let newEntry = document.createElement('div');
    newEntry.classList = 'alert alert-success row rounded toDoItem';
    newEntry.id = `toDoItem${id}`;
    return newEntry;
}

//Creates the span child element of the div element
function prepareToDoItemSpan(toDoItemText, idNumber) {
    let divSpan = document.createElement('div');
    divSpan.classList = 'col-sm-11';
    let span = document.createElement('span');
    span.class = 'toDoItemText';
    span.id = `toDoItemSpan${idNumber}`;
    span.textContent = toDoItemText;
    span.contentEditable = true;
    span.spellcheck = false;
    divSpan.appendChild(span);
    return divSpan;
}

//Creates the button child element of the div element
function prepareToDoItemRemovalButton(idNumber) {
    let divButton = document.createElement('div');
    divButton.classList = 'col-sm-1';
    let button = document.createElement('button');
    button.classList = 'alertButton close rounded';
    button.id = `addAlertButton${idNumber}`;
    button.innerHTML = '<span aria-hidden="true">&times;</span>';
    button.role = 'button';
    divButton.appendChild(button);
    return divButton;
}