// MIT License

// Copyright (c) [2021] [Grzegorz Latocha glatocha@gmail.com]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var projectSettings = {
    customFlags: [
        {
            name: "important",
            htmlTag: '<i class="fas fa-exclamation-triangle"></i>'
        },
        {
            name: "question",
            htmlTag: '<i class="fas fa-question"></i>'
        },
        {
            name: "mark",
            htmlTag: '<i class="fas fa-paperclip"></i>'
        },
        {
            name: "io",
            htmlTag: '<i class="fas fa-exchange-alt"></i>'
        },
        {
            name: "commun",
            htmlTag: '<i class="fas fa-network-wired"></i>'
        },
        {
            name: "hmi",
            htmlTag: '<i class="fas fa-desktop"></i>'
        },
        {
            name: "discuss",
            htmlTag: '<i class="fab fa-weixin"></i>'
        },
        {
            name: "female",
            htmlTag: '<i class="fas fa-female"></i>'
        },
        {
            name: "male",
            htmlTag: '<i class="fas fa-male"></i>'
        },
    ],
    projectColors: [
        "#9dc7ca",
        "#b6b6ff",
        "#ffc6aa",
        "#c8eabf",
        "#6cafaf",
        "white"
    ]
}

const expandBtns = document.querySelectorAll('.expandBtn');
const collapseBtns = document.querySelectorAll('.collapseBtn');


const navNewBtn = document.getElementById("navNewBtn");
const navSaveBtn = document.getElementById("navSaveBtn");
// const navOpenBtn = document.getElementById("navOpenBtn");
const navShareBtn = document.getElementById("navShareBtn");

const fileNameContainer = document.getElementById('file-name');

var edited = false; //this is set whenever any modification is done. Cleared when saved
var fileOpened = false;


appInit();

function documentChanged() {
    edited = true;
    document.getElementById('warningSection').classList.remove('hide');
}

function appInit() {
    document.getElementById('tree_container').innerHTML = ''
    document.getElementById('tree_container').appendChild(createTreeItem(null, true));
}

navNewBtn.addEventListener('click', newDocument)
navSaveBtn.addEventListener('click', saveToLocalStorage)

function createTreeItem(itemData = null, master = false) {
    if (itemData === null) {
        //create def element
        itemData = {
            // title: (master ? "Master item" : "Item title"),
            title: "",
            description: "",
            notes: 'Some defaults notes',
            bgColor: 'var(--primary-color)',
            // bgColor: '#9dc7ca',
            isParent: false,
            extraClass: '',
            tags: '',
            flags: '[false, false, false, false, false, false, false, false, false]',
            isOB: false,
            isFB: false,
            isFC: false,
            children: []
        }
    }
    //create the element
    var domEl
    if (master) {
        domEl = document.createElement('div');
    } else {
        domEl = document.createElement('li');
    }

    var addClasses = ''
    // addClasses = addClasses + (itemData.isParent ? ' tree-parent' : "");
    addClasses = addClasses + (itemData.isOB ? ' ob' : "");
    addClasses = addClasses + (itemData.isFB ? ' fb' : "");
    addClasses = addClasses + (itemData.isFC ? ' fc' : "");
    addClasses = addClasses + itemData.extraClass;

    //add classes
    if (master) {
        domEl.classList.add('tree-master');
    } else {
        domEl.classList.add('tree-item');
    }

    if (itemData.isParent) { domEl.classList.add('tree-parent') }

    const expandBtn = document.createElement('i')
    expandBtn.title = "Expand branch (+)  (alt+click for all)"
    expandBtn.className = "expandBtn fas fa-folder-plus"
    expandBtn.addEventListener('click', (e) => {
        if (e.altKey) { //expand all
            e.target.parentElement.parentElement.parentElement.querySelectorAll('.tree-parent').forEach(el => {
                el.classList.remove('collapsed');
            })
        }
        e.target.parentElement.parentElement.parentElement.classList.remove('collapsed')

    })

    const collapseBtn = document.createElement('i')
    collapseBtn.title = "Collapse branch (-) (alt+click for all)"
    collapseBtn.className = "collapseBtn fas fa-folder-minus"
    collapseBtn.addEventListener('click', (e) => {
        if (e.altKey) { //expand all
            e.target.parentElement.parentElement.parentElement.querySelectorAll('.tree-parent').forEach(el => {
                el.classList.add('collapsed');
            })
        }
        e.target.parentElement.parentElement.parentElement.classList.add('collapsed')
    })

    const editBtn = document.createElement('i')
    editBtn.title = "Edit element (F2)"
    editBtn.className = "editBtn fas fa-edit"
    editBtn.addEventListener('click', (e) => { editTreeItemModal_Open(e.target.parentElement.parentElement) })
    // editBtn.addEventListener('click', () => { console.log('Edit clicked') })

    const addChildBtn = document.createElement('i')
    addChildBtn.title = "Add child element (Enter)"
    addChildBtn.className = "addChildBtn fas fa-ellipsis-h"
    addChildBtn.addEventListener('click', (e) => {
        //console.log('parent :>> ', e.target.parentElement.parentElement.parentElement.parentElement);
        addChild(e.target.parentElement.parentElement.parentElement.parentElement)
    })

    const addSiblingBtn = document.createElement('i')
    addSiblingBtn.title = "Add sibling element (Alt+Enter)"
    addSiblingBtn.className = "addSiblingBtn fas fa-ellipsis-v"
    addSiblingBtn.addEventListener('click', (e) => { addSibbling(e.target.parentElement.parentElement.parentElement.parentElement) })

    const removeBtn = document.createElement('i')
    removeBtn.title = "Remove element (Del)"
    removeBtn.className = "removeBtn fas fa-trash-alt"
    removeBtn.addEventListener('click', (e) => { removeItem(e.target.parentElement.parentElement.parentElement.parentElement) })

    const labelEl = document.createElement('div')
    labelEl.tabIndex = 0;
    labelEl.className = `tree-item-label ${addClasses}`
    const input1 = document.createElement("input");
    input1.type = "text"; input1.className = "item-title"; input1.value = itemData.title; input1.placeholder = "Item title";
    const input2 = document.createElement("input");
    input2.type = "text"; input2.className = "item-description";
    input2.value = itemData.description; input2.placeholder = "Item description";

    input1.addEventListener('change', documentChanged);
    input2.addEventListener('change', documentChanged);
    labelEl.appendChild(input1);
    labelEl.appendChild(input2);
    labelEl.title = `${itemData.notes}`;
    labelEl.style.backgroundColor = itemData.bgColor;
    labelEl.dataset.flags = itemData.flags;
    labelEl.addEventListener('click', (e) => {
        if (e.ctrlKey) {
            labelEl.classList.toggle('selected');
            if (labelEl.classList.contains('selected')) {
                selectedItem = labelEl.parentElement;
                document.querySelectorAll('.tree-item-label').forEach(i => i.classList.remove('selected'));
                labelEl.classList.add('selected');
                displaySelectedMenu();
            } else {
                selectedItem = null;
                hideSelectedMenu();
            }
        }
    })

    const buttonsEl = document.createElement('div')
    buttonsEl.classList.add('extra-buttons')
    buttonsEl.appendChild(expandBtn);
    buttonsEl.appendChild(collapseBtn);
    buttonsEl.appendChild(editBtn);

    const spanEl = document.createElement('span')
    spanEl.appendChild(addChildBtn);
    spanEl.appendChild(addSiblingBtn);
    spanEl.appendChild(removeBtn);

    buttonsEl.appendChild(spanEl);
    labelEl.appendChild(buttonsEl);

    const flagsEl = document.createElement('div')
    flagsEl.classList.add('flags')
    //console.log('itemData.flags :>> ', itemData.flags);
    if ((itemData.flags != null) && (itemData.flags != 'undefined')) {
        JSON.parse(itemData.flags).forEach((flag, index) => {
            if (flag) {
                const flagEl = document.createElement('div')
                flagEl.innerHTML = projectSettings.customFlags[index].htmlTag;
                flagEl.title = projectSettings.customFlags[index].name;
                flagsEl.appendChild(flagEl);
            }
        })
    } else {
        itemData.flags = '[false, false, false, false, false, false, false, false, false]';
        labelEl.dataset.flags = itemData.flags;
    }

    labelEl.appendChild(flagsEl);

    domEl.appendChild(labelEl);
    const ulEl = document.createElement('ul')
    ulEl.className = "tree";
    domEl.appendChild(ulEl);

    return domEl
}

function addChild(parentEl, element = null, paste = false) {
    documentChanged();

    //console.log('parentEl :>> ', parentEl);
    if (parentEl.classList.contains('tree-parent')) { //already has childs
        const ulEl = parentEl.getElementsByTagName('ul')[0]
        //console.log('ulEl :>> ', ulEl);
        const newEl = createTreeItem(element);
        if (paste === false)
            newEl.querySelector('.tree-item-label').style.backgroundColor = parentEl.querySelector('.tree-item-label').style.backgroundColor;
        ulEl.insertBefore(newEl, ulEl.firstChild);
        // ulEl.appendChild(createTreeItem(element))
    } else {
        parentEl.classList.add('tree-parent');
        const ulEl = parentEl.getElementsByTagName('ul')[0]
        const newEl = createTreeItem(element);
        if (paste === false)
            newEl.querySelector('.tree-item-label').style.backgroundColor = parentEl.querySelector(".tree-item-label").style.backgroundColor;
        ulEl.appendChild(newEl);
        //parentEl.appendChild(ulEl)
    }
}

function addSibbling(siblingEl) {
    //console.log('siblingEl :>> ', siblingEl);
    const newEl = createTreeItem();
    newEl.querySelector('.tree-item-label').style.backgroundColor = siblingEl.querySelector(".tree-item-label").style.backgroundColor;
    siblingEl.parentElement.insertBefore(newEl, siblingEl.nextSibling)
    documentChanged();
}


function removeItem(itemToRemove) {
    if (confirm("Are you sure you want to delete")) {
        const childCount = itemToRemove.parentElement.children.length
        if (childCount === 1) {
            itemToRemove.parentElement.parentElement.classList.remove('tree-parent')
        }
        //console.log('childCount :>> ', childCount);
        itemToRemove.remove();
        documentChanged();
    }
}

function drawMainTree(treeData) {
    var domEl = createTreeItem(treeData, master = true)
    if (treeData.children != null) {
        treeData.children.forEach(ch => {
            var ulEl = domEl.getElementsByTagName('ul')[0]
            ulEl.appendChild(addItems(ch));
        })
    }
    //erase all
    document.getElementById('tree_container').innerHTML = '';
    document.getElementById('tree_container').appendChild(domEl);
}

function addItems(treeItem) {
    var domEl = createTreeItem(treeItem)
    if (treeItem.children != null) {
        treeItem.children.forEach(ch => {
            var ulEl = domEl.getElementsByTagName('ul')[0]
            ulEl.appendChild(addItems(ch));
        })
    }

    // console.log('treeItem :>> ', treeItem);
    return domEl;
}

function grabDOMtoJSON(topElement) {
    var tree_item = {
        title: "",
        description: "",
        notes: '',
        bgColor: '',
        isParent: false,
        extraClass: '',
        tags: '',
        flags: '',
        isOB: false,
        isFB: false,
        isFC: false,
        children: []
    }

    tree_item.title = topElement.querySelector('.item-title').value;
    tree_item.description = topElement.querySelector('.item-description').value;
    tree_item.notes = topElement.querySelector('.tree-item-label').title;
    tree_item.bgColor = topElement.querySelector('.tree-item-label').style.backgroundColor;
    tree_item.isParent = topElement.classList.contains('tree-parent');
    tree_item.extraClass = "";
    tree_item.tags = "";
    tree_item.flags = topElement.querySelector('.tree-item-label').dataset.flags;
    tree_item.isOB = topElement.querySelector('.tree-item-label').classList.contains('ob');
    tree_item.isFB = topElement.querySelector('.tree-item-label').classList.contains('fb');
    tree_item.isFC = topElement.querySelector('.tree-item-label').classList.contains('fc');

    //Need to convert from HTML collection to actual Array
    Array.from(topElement.querySelector('ul').children).forEach(li => {
        tree_item.children.push(grabDOMtoJSON(li))
    })
    return tree_item
    //console.log('tree_item :>> ', tree_item);
}

function newDocument() {
    if (edited) {
        if (!confirm("You have not saved changes, are you sure to start new project?")) {
            return
        }
    }
    document.getElementById('tree_container').innerHTML = ''
    document.getElementById('tree_container').appendChild(createTreeItem(null, true));
    fileOpened = false;
    fileNameContainer.innerText = '...new file...';
}


function saveToLocalStorage(saveName = null) {
    if (fileOpened) {
        saveName = fileNameContainer.innerText;
    } else {
        var saveName = prompt("Enter save name");
        console.log('saveName :>> ', saveName);
    }
    const projectObject = {
        settings: '',
        tree: "",
    }
    projectObject.settings = projectSettings;
    projectObject.tree = grabDOMtoJSON(document.querySelector('.tree-master'));
    // console.log('projectObject :>> ', projectObject);
    localStorage.setItem(saveName, JSON.stringify(projectObject));
    edited = false;
    document.getElementById('warningSection').classList.add('hide');
    fileOpened = true;
    fileNameContainer.innerText = saveName;
}

function loadFromLocalStorage(saveName) {
    // var saveName = prompt("Enter name to load")
    var items
    if (localStorage.getItem(saveName) != null) {
        const projectObject = JSON.parse(localStorage.getItem(saveName));
        items = projectObject.tree;
        projectSettings = projectObject.settings;
        // items = JSON.parse(localStorage.getItem(saveName)); //for old version without settings
        drawMainTree(items);
        edited = false;
        document.getElementById('warningSection').classList.add('hide');
        fileOpened = true;
        fileNameContainer.innerText = saveName;
    } else {
        alert('This name does not exists!')
    }
}



