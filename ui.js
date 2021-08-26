//main left nav buttons
const navOpenBtn = document.getElementById("navOpenBtn");
const navUploadBtn = document.getElementById("navUploadBtn");
const navDownloadBtn = document.getElementById("navDownloadBtn");
const navInfoBtn = document.getElementById("navInfoBtn");
const settingsBtn = document.getElementById("settingsBtn");

navOpenBtn.addEventListener('click', loadFileModal_Open);
navInfoBtn.addEventListener('click', infoModal_Open)
settingsBtn.addEventListener('click', (e) => {
    if (e.altKey) themeSettingsModal_Open();
    else projectSettingsModal_Open();
    // if (e.altKey) {
    //     themeSettingsModal_Open();
    // } else {
    //     projectSettingsModal_Open();
    // }
});
navDownloadBtn.addEventListener('click', init_downloadJSON);
navUploadBtn.addEventListener('click', init_uploadJSON);

// ON Scrolling - put top nav solid
window.addEventListener('scroll', () => {
    const scrollThr = 10;
    if (document.body.scrollTop > scrollThr || document.documentElement.scrollTop > scrollThr) {
        document.querySelector('.top-header').classList.add('stickToTop')
    } else {
        document.querySelector('.top-header').classList.remove('stickToTop')
    }
})

const modalBackground = document.getElementById('modalBackground');

//########### project Settings modal
const projectSettingsModal = document.getElementById('projectSettingsModal');
const projectSetting_UpdateBtn = document.getElementById('projectSetting_UpdateBtn');

function projectSettingsModal_Open() {
    modalBackground.classList.remove('hide');
    projectSettingsModal.classList.remove('hide');

    projectSettingsModal.querySelectorAll('.colorPicker-wrapper').forEach((cpw, i) => {
        cpw.style.backgroundColor = projectSettings.projectColors[i];
    });

    projectSettingsModal.querySelectorAll('.colorPicker').forEach(cp => {
        cp.addEventListener('change', (e) => {
            e.target.parentElement.style.backgroundColor = e.target.value;
        });
    });

    projectSettingsModal.querySelector('.closeWindow').addEventListener('click', () => {
        modalBackground.classList.add('hide');
        projectSettingsModal.classList.add('hide');
    });

    projectSettingsModal.querySelectorAll('tbody tr').forEach((row, index) => {
        //console.log('row :>> ', row);
        const tds = Array.from(row.querySelectorAll('td'))
        //console.log('tds :>> ', tds);
        tds[0].innerHTML = projectSettings.customFlags[index].htmlTag;
        tds[1].firstElementChild.value = projectSettings.customFlags[index].name;
        tds[2].firstElementChild.value = projectSettings.customFlags[index].htmlTag;
    })

    projectSettingsModal.querySelectorAll('.projectSettingsTagHTML').forEach((input, i) => {
        input.addEventListener('change', (e) => {
            e.target.parentElement.parentElement.firstElementChild.innerHTML = input.value;
        })
    });
}

projectSetting_UpdateBtn.addEventListener('click', e => {
    e.preventDefault();
    projectSettingsModal.querySelectorAll('.colorPicker-wrapper').forEach((cpw, i) => {
        projectSettings.projectColors[i] = cpw.style.backgroundColor;
    });
    projectSettingsModal.querySelectorAll('tbody tr').forEach((row, index) => {
        const tds = Array.from(row.querySelectorAll('td'))
        projectSettings.customFlags[index].name = tds[1].firstElementChild.value;
        projectSettings.customFlags[index].htmlTag = tds[2].firstElementChild.value;
    })
    modalBackground.classList.add('hide');
    projectSettingsModal.classList.add('hide');
    documentChanged();
});

//########### END OF project Settings modal



//########### edit tree item modal
const editTreeItemModal = document.getElementById('editTreeItemModal');
const editModal_UpdateBtn = document.getElementById('editModal_UpdateBtn');
const editModalItemTitle = document.getElementById('editModalItemTitle');
const editModalItemDescr = document.getElementById('editModalItemDescr');
const editModalItemNotes = document.getElementById('editModalItemNotes');
const editModalColorPickerWrapper = document.getElementById('editModalColorPickerWrapper');
const editModalColorPicker = document.getElementById('editModalColorPicker');
const editModalColorPickerAll = document.getElementById('editModalColorPickerAll');
const editModalColorPickerTray = document.getElementById('editModalColorPickerTray');
var elementUnderEdit

editModalColorPicker.addEventListener('change', (e) => {
    editModalColorPickerWrapper.style.backgroundColor = e.target.value;
})

function editTreeItemModal_Open(itemDomEl) {

    //load project colors to the selector
    editModalColorPickerAll.querySelectorAll('.colorPickerTemplate').forEach((cp, index) => {
        cp.style.backgroundColor = projectSettings.projectColors[index];
        cp.addEventListener('click', () => {
            editModalColorPickerWrapper.style.backgroundColor = cp.style.backgroundColor;
            editModalColorPickerTray.classList.remove('show');
        })
    })

    //load flags
    editTreeItemModal.querySelectorAll('.flags label').forEach((l, index) => {
        l.parentElement.firstElementChild.checked = JSON.parse(itemDomEl.dataset.flags)[index];
        l.innerHTML = projectSettings.customFlags[index].htmlTag + projectSettings.customFlags[index].name;
    })

    elementUnderEdit = itemDomEl;
    // itemDomEl is a label div
    //loading texts from dom
    editModalItemTitle.value = itemDomEl.querySelector('.item-title').value;
    editModalItemDescr.value = itemDomEl.querySelector('.item-description').value;
    editModalItemNotes.value = itemDomEl.title;
    editModalColorPickerWrapper.style.backgroundColor = itemDomEl.style.backgroundColor;

    //console.log('itemDomEl :>> ', itemDomEl);
    modalBackground.classList.remove('hide');
    editTreeItemModal.classList.remove('hide');

    editTreeItemModal.querySelector('.closeWindow').addEventListener('click', () => {
        modalBackground.classList.add('hide');
        editTreeItemModal.classList.add('hide');
    })
}

editModalColorPickerAll.addEventListener('mouseenter', (e) => editModalColorPickerTray.classList.add('show'))
editModalColorPickerAll.addEventListener('mouseleave', (e) => editModalColorPickerTray.classList.remove('show'))

editModal_UpdateBtn.addEventListener('click', e => {
    e.preventDefault();
    elementUnderEdit.querySelector('.item-title').value = editModalItemTitle.value;
    elementUnderEdit.querySelector('.item-description').value = editModalItemDescr.value;
    elementUnderEdit.title = editModalItemNotes.value;
    elementUnderEdit.style.backgroundColor = editModalColorPickerWrapper.style.backgroundColor;
    modalBackground.classList.add('hide');
    editTreeItemModal.classList.add('hide');

    //update flags
    var flags = [];
    elementUnderEdit.querySelector('.flags').innerHTML = '';
    editTreeItemModal.querySelectorAll('.flags input').forEach((cb, index) => {
        //console.log('cb :>> ', cb.checked);
        //update dataset:
        flags.push(cb.checked)
        //update dom:
        if (cb.checked) {
            const flagEl = document.createElement('div')
            flagEl.innerHTML = projectSettings.customFlags[index].htmlTag;
            flagEl.title = projectSettings.customFlags[index].name;
            elementUnderEdit.querySelector('.flags').appendChild(flagEl);
        }
    });
    elementUnderEdit.dataset.flags = JSON.stringify(flags);

    documentChanged();
});


//########### END OF edit tree item modal

//########### loading file modal
const listEl = document.getElementById('listOfFilesToLoad');
const loadingFileModal = document.getElementById('loadingFilesSelectModal');
const loadFileBtn = document.getElementById('modal_loadFileBtn');
const filesToSelectInput = document.getElementById('filesToSelect');

function loadFileModal_Open() {
    modalBackground.classList.remove('hide');
    loadingFileModal.classList.remove('hide');

    loadingFileModal.querySelector('.closeWindow').addEventListener('click', () => {
        modalBackground.classList.add('hide');
        loadingFileModal.classList.add('hide');
    })

    listOfFilesToLoad.innerHTML = '';

    Object.keys(localStorage).forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        li.addEventListener('click', () => filesToSelectInput.value = item)
        listOfFilesToLoad.appendChild(li);
    })
}

loadFileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (filesToSelectInput.value != "") {
        loadFromLocalStorage(filesToSelectInput.value);
        modalBackground.classList.add('hide');
        loadingFileModal.classList.add('hide');
    }
})
//########### END OF loading file modal

//########### info page Modal
const infoModal = document.getElementById("infoModal");
function infoModal_Open() {
    modalBackground.classList.remove('hide');
    infoModal.classList.remove('hide');

    infoModal.querySelector('.closeWindow').addEventListener('click', () => {
        modalBackground.classList.add('hide');
        infoModal.classList.add('hide');
    })
}
//########### END OF info page modal

//########### Theme Settings modal
const themeSettingsModal = document.getElementById('themeSettingsModal');
const themeSetting_UpdateBtn = document.getElementById('themeSetting_UpdateBtn');

function themeSettingsModal_Open() {
    // modalBackground.classList.remove('hide');
    themeSettingsModal.classList.remove('hide');

    // themeSettingsModal.querySelectorAll('.colorPicker-wrapper').forEach((cpw, i) => {
    //     cpw.style.backgroundColor = projectSettings.projectColors[i];
    // });
    themeSettingsModal.querySelector('#thSetBGColor').value = getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim();
    themeSettingsModal.querySelector('#thSetPrimColor').value = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    themeSettingsModal.querySelector('#thSetSeColor').value = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
    themeSettingsModal.querySelector('#thSetTLColor').value = getComputedStyle(document.documentElement).getPropertyValue('--tree-lines-color').trim();
    themeSettingsModal.querySelector('#thSetNavBGColor').value = getComputedStyle(document.documentElement).getPropertyValue('--menu-bgColor').trim();
    themeSettingsModal.querySelector('#thSetNavColor').value = getComputedStyle(document.documentElement).getPropertyValue('--nav-iconColor').trim();
    themeSettingsModal.querySelector('#thSetFlagColor').value = getComputedStyle(document.documentElement).getPropertyValue('--flags-color').trim();

    themeSettingsModal.querySelectorAll('.colorPicker').forEach(cp => {
        cp.parentElement.style.backgroundColor = cp.value;
        cp.addEventListener('change', (e) => {
            e.target.parentElement.style.backgroundColor = e.target.value;
            e.target.parentElement.parentElement.querySelector('i').innerText = e.target.value;
        });
    });

    themeSettingsModal.querySelector('.closeWindow').addEventListener('click', () => {
        // modalBackground.classList.add('hide');
        themeSettingsModal.classList.add('hide');
    });

}

themeSetting_UpdateBtn.addEventListener('click', e => {
    e.preventDefault();
    // modalBackground.classList.add('hide');
    // projectSettingsModal.classList.add('hide');
    document.documentElement.style.setProperty('--background-color', themeSettingsModal.querySelector('#thSetBGColor').value);
    document.documentElement.style.setProperty('--primary-color', themeSettingsModal.querySelector('#thSetPrimColor').value);
    document.documentElement.style.setProperty('--secondary-color', themeSettingsModal.querySelector('#thSetSeColor').value);
    document.documentElement.style.setProperty('--tree-lines-color', themeSettingsModal.querySelector('#thSetTLColor').value);
    document.documentElement.style.setProperty('--menu-bgColor', themeSettingsModal.querySelector('#thSetNavBGColor').value);
    document.documentElement.style.setProperty('--nav-iconColor', themeSettingsModal.querySelector('#thSetNavColor').value);
    document.documentElement.style.setProperty('--flags-color', themeSettingsModal.querySelector('#thSetFlagColor').value);

    documentChanged();
});

//########### END OF Theme settings modal


function init_downloadJSON() {
    const projectObject = {
        settings: '',
        tree: "",
    }
    projectObject.settings = projectSettings;
    projectObject.tree = grabDOMtoJSON(document.querySelector('.tree-master'));
    var data = JSON.stringify(projectObject);
    var fileName = fileNameContainer.innerText + '.json';
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    var dlAnchorElem = document.getElementById('navDownloadAnch');
    // console.log("Download JSON Clicked");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", fileName);
    dlAnchorElem.click();
}

document.getElementById("navUploadAnch").addEventListener('input', (e) => {

    var files = document.getElementById('navUploadAnch').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function (e) {
        console.log(e);
        var result = JSON.parse(e.target.result);
        var formatted = JSON.stringify(result, null, 2);
        const projectObject = result;
        var items = projectObject.tree;
        projectSettings = projectObject.settings;
        // items = JSON.parse(localStorage.getItem(saveName)); //for old version without settings
        drawMainTree(items);

        //drawMainTree(result);
        edited = false;
        document.getElementById('warningSection').classList.add('hide');
        fileOpened = true;
        fileNameContainer.innerText = files.item(0).name.split(".")[0];
    }

    fr.readAsText(files.item(0));

})
function init_uploadJSON() {
    document.getElementById("navUploadAnch").click();

}
