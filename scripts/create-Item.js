//Creates new div element
function createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue) {
    const list = document.getElementById('toDoList');
    let alertClass = '';

    if (checkBoxValue === 'unchecked') {
        checkBoxValue = false;
    } else {
        checkBoxValue = true;
    }

    //Creates the div element and its children elements
    const toDoItemDivCheckBox = prepareCheckbox(idNumber, checkBoxValue);
    const toDoItemDivSpan = prepareToDoItemSpan(toDoItemText, idNumber);
    const divRemovalButton = prepareToDoItemRemovalButton(idNumber);

    if (toDoItemDivCheckBox.children[0].checked) {
        alertClass = 'alert-secondary';
    } else {
        alertClass = 'alert-success';
    }
    const newEntry = prepareToDoItem(idNumber, alertClass, animationValue);

    //Appends children elements to parent div elements
    newEntry.appendChild(toDoItemDivCheckBox);
    newEntry.appendChild(toDoItemDivSpan);
    newEntry.appendChild(divRemovalButton);

    //Changes the parent elements' classlist according to the state of the checkbox
    toDoItemDivCheckBox.firstChild.addEventListener('change', function () {
        if (this.checked) {
            editToDoItem(toDoItemDivCheckBox.firstChild.id);
        } else {
            editToDoItem(toDoItemDivCheckBox.firstChild.id);
        }
    });

    //Commit changes after the element loses focus
    toDoItemDivSpan.firstChild.addEventListener('blur',
        function (event) {
            event.preventDefault();
            editToDoItem(toDoItemDivSpan.firstChild.id);
            setTextIfNoToDoItems();
        });

    //Delete div element after button is clicked
    divRemovalButton.addEventListener('click',
        function (event) {
            event.preventDefault();
            deleteToDoItem(newEntry.id);
            setTextIfNoToDoItems();
        });

    //Appends div element to its parent div element and updates the page
    list.prepend(newEntry);
    setToDoTextBoxText();

    return newEntry;
}

//Creates the div element
function prepareToDoItem(id, alertClass, animationValue) {
    const newEntry = document.createElement('div');
    newEntry.classList = `alert ${alertClass} row rounded toDoItem ${animationValue}`;
    newEntry.id = `toDoItem${id}`;
    return newEntry;
}

//Creates the span child element of the div element
function prepareToDoItemSpan(toDoItemText, idNumber) {
    const divSpan = document.createElement('div');
    divSpan.classList = 'col-sm-10';

    const span = document.createElement('span');
    span.classList = 'toDoItemText';
    span.id = `toDoItemSpan${idNumber}`;
    span.textContent = toDoItemText;
    span.contentEditable = true;
    span.spellcheck = false;

    divSpan.appendChild(span);
    return divSpan;
}

//Creates the button child element of the div element
function prepareToDoItemRemovalButton(idNumber) {
    const divButton = document.createElement('div');
    divButton.classList = 'col-sm-1';

    const button = document.createElement('button');
    button.classList = 'alertButton close rounded';
    button.id = `addAlertButton${idNumber}`;
    button.innerHTML = '<span aria-hidden="true">&times;</span>';
    button.role = 'button';

    divButton.appendChild(button);
    return divButton;
}

//Create the checkbox child element of the div element
function prepareCheckbox(idNumber, checkBoxValue) {
    const divCheckbox = document.createElement('div');
    divCheckbox.classList = 'col-sm-1 custom-control custom-checkbox';

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.classList = 'custom-control-input checkBox';
    checkBox.id = `toDoCheckBox${idNumber}`;
    checkBox.checked = checkBoxValue;

    const checkBoxLabel = document.createElement('label');
    checkBoxLabel.classList = 'custom-control-label';
    checkBoxLabel.for = `checkBox${idNumber}`;

    divCheckbox.appendChild(checkBox);
    divCheckbox.appendChild(checkBoxLabel);
    return divCheckbox;
}