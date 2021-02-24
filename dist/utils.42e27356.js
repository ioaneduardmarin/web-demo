// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/global-State.js":[function(require,module,exports) {
var app = {
  idOfLastEnteredToDoItem: 0,
  orderNumberOfLastCheckedItem: 0,
  toDoItems: [],
  idOfLastModifiedItem: ''
};
module.exports = {
  app: app
};
},{}],"scripts/page-Input-Utils.js":[function(require,module,exports) {
//Gets text from input element
function getToDoTextBoxText() {
  return document.querySelector('#addTodoTextBox').value;
} //Resets input text content state to empty


function setToDoTextBoxText() {
  document.querySelector('#addTodoTextBox').value = '';
} //Sets the visibility state of the element with id equal to 'noToDoItemInfo'


function setTextIfNoToDoItems() {
  document.querySelector('#noToDoItemInfo').hidden = doTodoItemsExist();
} //Checks if the parent div element has children elemens


function doTodoItemsExist() {
  var number = document.querySelector('#toDoList').childElementCount;

  if (parseInt(number) > 0) {
    return true;
  }

  return false;
}

module.exports = {
  getToDoTextBoxText: getToDoTextBoxText,
  setToDoTextBoxText: setToDoTextBoxText,
  setTextIfNoToDoItems: setTextIfNoToDoItems
};
},{}],"scripts/sync-Page.js":[function(require,module,exports) {
var globalState = require('./global-State.js'); //Deletes al div elements


function popElements() {
  var toDoItems = window.document.querySelectorAll('#toDoList > .toDoItem');
  toDoItems.forEach(function (element) {
    return element.parentNode.removeChild(element);
  });
} //Gets the objects that contain important data of the existing div elements from local storage


function getMyStorage(args) {
  var keyNumbers = [];

  if (args === 'localStorageArgs') {
    //Extracts keys of the local storage objects and orders them
    var keys = Object.keys(window.localStorage);
    keys = keys.filter(function (key) {
      return key.includes('toDoItem');
    });
    keys.forEach(function (key) {
      return keyNumbers.push(parseInt(key.slice(8)));
    });
    keyNumbers.sort(function (a, b) {
      return a - b;
    });
  } else {
    var objects = globalState.app.toDoItems;
    objects.forEach(function (object) {
      return keyNumbers.push(parseInt(object.toDoId.slice(8)));
    });
    keyNumbers.sort(function (a, b) {
      return a - b;
    });
  } //Fills the toDoObject array with the sorted local storage objects that contain important data of the existing div elements


  var toDoObjects = [];
  var toDoObject;
  var priorityToDoObjects = [];
  keyNumbers.forEach(function (k) {
    if (args === 'localStorageArgs') {
      toDoObject = JSON.parse(window.localStorage.getItem("toDoItem".concat(k)));
    } else {
      toDoObject = globalState.app.toDoItems.filter(function (object) {
        return object.toDoId === "toDoItem".concat(k);
      })[0];
    }

    if (toDoObject.checkingOrderNumber !== null) {
      priorityToDoObjects.push(toDoObject);
    } else {
      toDoObjects.push(toDoObject);
    }

    priorityToDoObjects = priorityToDoObjects.sort(function (a, b) {
      return parseInt(a.checkingOrderNumber) - parseInt(b.checkingOrderNumber);
    });
  });
  return priorityToDoObjects.concat(toDoObjects);
} //Sync Data


function getSyncData() {
  globalState.app.toDoItems = getMyStorage('localStorageArgs');
  globalState.app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems') === null ? 0 : parseInt(window.localStorage.getItem('numberOfItems'));
  globalState.app.orderNumberOfLastCheckedItem = window.localStorage.getItem('numberOfPrioritizedItems') === null ? 0 : parseInt(window.localStorage.getItem('numberOfPrioritizedItems'));
  globalState.app.idOfLastModifiedItem = window.localStorage.getItem('idOfLastModifiedItem') === null ? '' : window.localStorage.getItem('idOfLastModifiedItem');
}

module.exports = {
  popElements: popElements,
  getMyStorage: getMyStorage,
  getSyncData: getSyncData
};
},{"./global-State.js":"scripts/global-State.js"}],"scripts/create-Item.js":[function(require,module,exports) {
//Creates new div element
function createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue) {
  var alertClass = '';

  if (checkBoxValue === 'unchecked') {
    checkBoxValue = false;
  } else {
    checkBoxValue = true;
  } //Creates the div element and its children elements


  var toDoItemDivCheckBox = prepareCheckbox(idNumber, checkBoxValue);
  var toDoItemDivSpan = prepareToDoItemSpan(toDoItemText, idNumber);
  var divRemovalButton = prepareToDoItemRemovalButton(idNumber);

  if (toDoItemDivCheckBox.children[0].checked) {
    alertClass = 'alert-secondary';
  } else {
    alertClass = 'alert-success';
  }

  var newEntry = prepareToDoItem(idNumber, alertClass, animationValue); //Appends children elements to parent div elements

  newEntry.appendChild(toDoItemDivCheckBox);
  newEntry.appendChild(toDoItemDivSpan);
  newEntry.appendChild(divRemovalButton);
  return newEntry;
} //Creates the div element


function prepareToDoItem(id, alertClass, animationValue) {
  var newEntry = window.document.createElement('div');
  newEntry.classList = "alert ".concat(alertClass, " row rounded toDoItem ").concat(animationValue);
  newEntry.id = "toDoItem".concat(id);
  return newEntry;
} //Creates the span child element of the div element


function prepareToDoItemSpan(toDoItemText, idNumber) {
  var divSpan = window.document.createElement('div');
  divSpan.classList = 'col-sm-10';
  var span = window.document.createElement('span');
  span.classList = 'toDoItemText';
  span.id = "toDoItemSpan".concat(idNumber);
  span.textContent = toDoItemText;
  span.contentEditable = true;
  span.spellcheck = false;
  divSpan.appendChild(span);
  return divSpan;
} //Creates the button child element of the div element


function prepareToDoItemRemovalButton(idNumber) {
  var divButton = window.document.createElement('div');
  divButton.classList = 'col-sm-1';
  var button = window.document.createElement('button');
  button.classList = 'alertButton close rounded';
  button.id = "addAlertButton".concat(idNumber);
  button.innerHTML = '<span aria-hidden="true">&times;</span>';
  button.role = 'button';
  divButton.appendChild(button);
  return divButton;
} //Create the checkbox child element of the div element


function prepareCheckbox(idNumber, checkBoxValue) {
  var divCheckbox = window.document.createElement('div');
  divCheckbox.classList = 'col-sm-1 custom-control custom-checkbox';
  var checkBox = window.document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.classList = 'custom-control-input checkBox';
  checkBox.id = "toDoCheckBox".concat(idNumber);
  checkBox.checked = checkBoxValue;
  var checkBoxLabel = window.document.createElement('label');
  checkBoxLabel.classList = 'custom-control-label';
  checkBoxLabel.for = "checkBox".concat(idNumber);
  divCheckbox.appendChild(checkBox);
  divCheckbox.appendChild(checkBoxLabel);
  return divCheckbox;
}

module.exports = {
  createToDoItem: createToDoItem
};
},{}],"scripts/utils.js":[function(require,module,exports) {
var globalState = require('./global-State.js');

var pageInputUtils = require('./page-Input-Utils.js');

var syncPage = require('./sync-Page.js');

var createItem = require('./create-Item.js'); //Updates the list of div elements


function onUpdate(args, animationClass) {
  syncPage.popElements();
  globalState.app.toDoItems = syncPage.getMyStorage(args);
  globalState.app.toDoItems.forEach(function (element) {
    return addToDoItemOnUpdate(element.toDoId, element.contentText, element.toDoCheckBoxValue, element.toDoId === globalState.app.idOfLastModifiedItem ? "".concat(animationClass) : '');
  });
} //Creates div and its children elements and adds them to the parent div element(used when the page is refreshed and when the local storage was modified)


function addToDoItemOnUpdate(toDoItemId, toDoItemText, checkBoxValue, animationValue) {
  var idNumber = parseInt(toDoItemId.slice(8));
  globalState.app.idOfLastEnteredToDoItem = idNumber;
  prependToDoItemToParentElement(idNumber, toDoItemText, checkBoxValue, animationValue);
}

function prependToDoItemToParentElement(idNumber, toDoItemText, checkBoxValue, animationValue) {
  var list = window.document.getElementById('toDoList'); //Creates new div element

  var newEntry = createItem.createToDoItem(idNumber, toDoItemText, checkBoxValue, animationValue); //Add event listeners for the 3 child elements of the newEntry

  newEntry = addEventListeners(newEntry); //Appends div element to its parent div element and updates the page

  list.prepend(newEntry);
  return newEntry;
} //Add event listeners for the 3 child elements of the toDoItem


function addEventListeners(toDoItem) {
  //Changes the parent elements' classlist according to the state of the checkbox
  toDoItem.children[0].firstChild.addEventListener('change', function () {
    editToDoItemCheckBox(toDoItem.children[0].firstChild.id);
  }); //Commit changes after the element loses focus

  toDoItem.children[1].firstChild.addEventListener('blur', function (event) {
    event.preventDefault();
    editToDoItemSpan(toDoItem.children[1].firstChild.id);
    pageInputUtils.setTextIfNoToDoItems();
  }); //Delete div element after button is clicked

  toDoItem.children[2].addEventListener('click', function (event) {
    event.preventDefault();
    deleteToDoItem(toDoItem.id);
    pageInputUtils.setTextIfNoToDoItems();
  });
  return toDoItem;
} //Represents the whole process undertaken to add an item and adapt the page according to its addition


function addNewToDoItem() {
  if (!pageInputUtils.getToDoTextBoxText()) {
    return;
  } //Determines the idNumber of the last entered item to determine what Ids will the div element and its children element will have


  globalState.app.idOfLastEnteredToDoItem = window.localStorage.getItem('numberOfItems');
  globalState.app.idOfLastEnteredToDoItem++; //Add div to parent element

  var newEntry = prependToDoItemToParentElement(globalState.app.idOfLastEnteredToDoItem, pageInputUtils.getToDoTextBoxText(), 'unchecked', "xyz-in"); //Updates the idNumber of the last entered item

  window.localStorage.setItem('numberOfItems', globalState.app.idOfLastEnteredToDoItem); //Appends important element data to local storage

  var toDoObject = {
    toDoId: newEntry.id,
    contentText: newEntry.children[1].textContent,
    toDoCheckBoxValue: 'unchecked',
    checkingOrderNumber: null
  };
  window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
  globalState.app.toDoItems.push(toDoObject);
  globalState.app.toDoItems = syncPage.getMyStorage();
  pageInputUtils.setToDoTextBoxText();
  pageInputUtils.setTextIfNoToDoItems();
  window.toastr["success"]("Item succesfully added!", "Success!");
} //Deletes the item found with the given id


function deleteToDoItem(id) {
  var toBeDeleted = window.document.getElementById(id);

  if (!toBeDeleted) {
    return;
  }

  globalState.app.idOfLastModifiedItem = id;
  window.localStorage.setItem('idOfLastModifiedItem', id);
  window.document.getElementById(id).classList.remove('xyz-in');
  window.document.getElementById(id).classList.add('xyz-out');
  window.setTimeout(function () {
    window.document.querySelector('#toDoList').removeChild(window.document.getElementById("".concat(id)));
    window.localStorage.removeItem(id);
    globalState.app.toDoItems = globalState.app.toDoItems.filter(function (object) {
      return object.toDoId !== id;
    });
    window.toastr["success"]("Item succesfully deleted!", "Success!");
    pageInputUtils.setTextIfNoToDoItems();
  }, 300);
} //Edits the span item found with the given id or deletes its parent if span element is empty after edit


function editToDoItemSpan(id) {
  var toBeEdited = window.document.getElementById(id);
  var localStorageObject = globalState.app.toDoItems.filter(function (object) {
    return object.toDoId === "toDoItem".concat(id.substr(12));
  })[0];
  var localStorageObjectIndex = globalState.app.toDoItems.findIndex(function (object) {
    return object.toDoId === localStorageObject.toDoId;
  });
  var toDoObject = {};

  if (toBeEdited.textContent) {
    toDoObject = {
      toDoId: "toDoItem".concat(id.substr(12)),
      contentText: toBeEdited.textContent,
      toDoCheckBoxValue: localStorageObject.toDoCheckBoxValue,
      checkingOrderNumber: localStorageObject.checkingOrderNumber
    };
    window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
    globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
    return;
  }

  deleteToDoItem("toDoItem".concat(id.substr(12)));
  globalState.app.toDoItems = globalState.app.toDoItems.filter(function (object) {
    return object.toDoId !== toDoObject.toDoId;
  });
}

function editToDoItemCheckBox(id) {
  var toBeEdited = window.document.getElementById(id);
  var localStorageObject = globalState.app.toDoItems.filter(function (object) {
    return object.toDoId === "toDoItem".concat(id.substr(12));
  })[0];
  var localStorageObjectIndex = globalState.app.toDoItems.findIndex(function (object) {
    return object.toDoId === localStorageObject.toDoId;
  });
  var toDoObject = {};

  if (toBeEdited.checked) {
    globalState.app.orderNumberOfLastCheckedItem++;
    toDoObject = {
      toDoId: "toDoItem".concat(id.substr(12)),
      contentText: localStorageObject.contentText,
      toDoCheckBoxValue: 'checked',
      checkingOrderNumber: globalState.app.orderNumberOfLastCheckedItem
    };
    window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
    globalState.app.idOfLastModifiedItem = toDoObject.toDoId;
    window.document.getElementById(toDoObject.toDoId).classList.remove('xyz-in');
    window.document.getElementById(toDoObject.toDoId).classList.add('xyz-out');
    window.setTimeout(function () {
      window.localStorage.setItem('numberOfPrioritizedItems', globalState.app.orderNumberOfLastCheckedItem);
      window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
      globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
      onUpdate('', 'xyz-in');
    }, 200);
  } else {
    toDoObject = {
      toDoId: "toDoItem".concat(id.substr(12)),
      contentText: localStorageObject.contentText,
      toDoCheckBoxValue: 'unchecked',
      checkingOrderNumber: null
    };
    window.localStorage.setItem('idOfLastModifiedItem', toDoObject.toDoId);
    globalState.app.idOfLastModifiedItem = toDoObject.toDoId;
    window.document.getElementById(toDoObject.toDoId).classList.remove('xyz-in');
    window.document.getElementById(toDoObject.toDoId).classList.add('xyz-out');
    window.setTimeout(function () {
      window.localStorage.setItem(toDoObject.toDoId, JSON.stringify(toDoObject));
      globalState.app.toDoItems[localStorageObjectIndex] = toDoObject;
      onUpdate('', 'xyz-in');
    }, 200);
  }
}

module.exports = {
  onUpdate: onUpdate,
  addNewToDoItem: addNewToDoItem
};
},{"./global-State.js":"scripts/global-State.js","./page-Input-Utils.js":"scripts/page-Input-Utils.js","./sync-Page.js":"scripts/sync-Page.js","./create-Item.js":"scripts/create-Item.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50080" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/utils.js"], null)
//# sourceMappingURL=/utils.42e27356.js.map