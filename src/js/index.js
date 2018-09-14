/**
 * Define helper functions
 */

/**
 * Define shorthand function to replace `document.querySelector`
 * to make it easier to write and understand
 * @param {Node} el - CSS selector element which needs to be `querySelector`ed
 * @returns qureied element
 */
const getHtmlElement = (el) => {
    return document.querySelector(el);
};

/**
 * Define shorthand function to replace `element.classList.add`
 * @param {Node} el - CSS selector element whose class needs to be modified
 * @param {String} className - class name that needs to be appended to classlist
 */
const addClass = (el, className) => {
    el.classList.add(className);
};

/**
 * Define shorthand function to replace `element.classList.remove`
 * @param {Node} el - CSS selector element whose class needs to be modified
 * @param {String} className - class name that needs to be removed from classlist
 */
const removeClass = (el, className) => {
    el.classList.remove(className);
};

/**
 * Define shorthand function to toggle `element.classList.toggle`
 * @param {Node} el - CSS selector element whose class needs to be modified
 * @param {String} className - class name that needs to be removed from classlist
 
const toggleClass = (el, className) => {
    el.classList.toggle(className);
};
*/

/**
 * Declare global variables
 */
const renderBox                = getHtmlElement('.markdown-body');
const textarea                 = getHtmlElement('textarea');
const mainSection              = getHtmlElement('section.main');
const dashboardSection         = getHtmlElement('section.dashboard');
const historySection           = getHtmlElement('section.history');
const settingsSection          = getHtmlElement('section.settings');
const notelistSection          = getHtmlElement('section.notelist');
const noteaddSection           = getHtmlElement('section.notes-add');
const noteeditSection          = getHtmlElement('section.notes-edit');
let rawText                    = localStorage.getItem('rawText');
let activeModals               = [];  // array of active modals
let saveHistory;               // settings.saveHistory Boolean
let cursorLastPosition;        // settings.cursorLastPosition Boolean
let sectionMainEventListener;  // section.main eventListener (defined in `openModal` function)
let converter;                 // Main markdown rendering converter (defined in `initiate` function)

/**
 * Toggle between renderBox and textarea
 * @param n - If n = 1, display renderBox, else display textarea
 */
const toggleDisplay = (n) => {

    if (n) {
        removeClass(textarea, 'nodisplay');
        addClass(renderBox, 'nodisplay');
    }

    else {
        addClass(textarea, 'nodisplay');
        removeClass(renderBox, 'nodisplay');
    }

};

/**
 * Move the textarea caret to the start of the
 * line instead of the last line so that it is visible
 * From https://stackoverflow.com/a/8190890/
 */
const moveCaretToStart = (selectionEnd = -1, selectionStart = -1) => {

    if (typeof textarea.selectionStart === 'number') {
        textarea.selectionStart = textarea.selectionEnd = 0;
        if(selectionEnd !== -1)
            textarea.selectionEnd = selectionEnd;
        if(selectionStart !== -1)
            textarea.selectionStart = selectionStart;
    }
    else if (typeof textarea.createTextRange !== 'undefined') {
        textarea.focus();
        const range = textarea.createTextRange();
        range.collapse(true);
        if(selectionEnd !== -1)
            range.moveEnd('character', selectionEnd);
        if(selectionStart !== -1)
            range.moveStart('character', selectionStart);
        range.select();
    }

};
const show = () => {
    toggleDisplay(0);
    moveCaretToStart();
    textarea.focus();
    textarea.scrollTop = 0;
    const text = textarea.value;
    const html = converter.makeHtml(text);
    renderBox.innerHTML = html;
    removeClass(getHtmlElement('#edit'), 'nodisplay');
    addClass(getHtmlElement('#save'), 'nodisplay');
};
// Main edit function
const edit = () => {

    toggleDisplay(1);
    textarea.focus();

    if (cursorLastPosition) {
        if(lastOpenedNote === 'default') {
            const pos = Number(localStorage.getItem('cursorLastPosition'));
            moveCaretToStart(Number(pos), Number(pos));
        }
        else {
            const note = getNote(lastOpenedNote);
            if(note !== null && 'cursorLastPosition' in note) {
                const pos = Number(note.cursorLastPosition);
                moveCaretToStart(Number(pos), Number(pos));
            } 
        }
    }

    else {
        moveCaretToStart();
        textarea.scrollTop = 0;
    }

    // Toggle button display
    removeClass(getHtmlElement('#save'), 'nodisplay');
    addClass(getHtmlElement('#edit'), 'nodisplay');

};

// Main save function
const save = () => {


    toggleDisplay(0);
    const text = textarea.value;
    const html = converter.makeHtml(text);
    renderBox.innerHTML = html;

    if (html !== converter.makeHtml(rawText)) {
        if(lastOpenedNote === 'default') {
            localStorage.setItem('rawText', text);
            localStorage.setItem('cursorLastPosition', textarea.selectionStart);
            rawText = text;
            if (saveHistory) {
                localStorage.setItem('lastEdited', (new Date()));
                setHistory();
            }
        }
        else {
            const notes = localStorage.getItem('notes');
            if(notes !== null) {
                const noteObj = JSON.parse(notes);
                if(lastOpenedNote in noteObj) {
                    const note = noteObj[lastOpenedNote];
                    note.rawText = text;
                    rawText = text;
                    note.lastEdited = new Date();
                    note.cursorLastPosition = textarea.selectionStart;
                    note.history = [];
                    if(saveHistory) {
                        note.history = updateNoteHistory(note);
                    }
                    noteObj[lastOpenedNote] = note;
                    localStorage.setItem('notes', JSON.stringify(noteObj));
                }
            }
        }
    }

    // Toggle button display
    removeClass(getHtmlElement('#edit'), 'nodisplay');
    addClass(getHtmlElement('#save'), 'nodisplay');

};

/**
 * returns a note object based on note id or null
 * @param {string} noteid 
 */
const getNote = (noteid) => {
    const notes = localStorage.getItem('notes');
    if(notes !== null) {
        const noteObj = JSON.parse(notes);
        if(noteid in noteObj) {
            return noteObj[noteid];
        }
    }
    return null;
};

/**
 * overwrite compelete history of note
 * @param {Array} history 
 */
const setNoteHistory =  (history) => {
    const notes = localStorage.getItem('notes');
    if(notes !== null) {
        const noteObj = JSON.parse(notes);
        if(lastOpenedNote in noteObj) {
            const note = noteObj[lastOpenedNote];
            note.history = history;
            localStorage.setItem('notes', JSON.stringify(noteObj));
        }
    }
};

/**
 * adds to note's history
 * @param {Object} note 
 */
const updateNoteHistory = (note) => {
    const history = note.history;
    const historyItem = {
        'date': (new Date()),
        'text': rawText
    };
    history.unshift(historyItem);
    return history;
};

/**
 * returns array of history for lastOpenedNote 
 */
const getNoteHistory = () => {
    if(lastOpenedNote === 'default') {return getHistory(); }
    const history = [];
    const notes = localStorage.getItem('notes');
    if(notes !== null) {
        const noteObj = JSON.parse(notes);
        if(lastOpenedNote in noteObj) {
            return noteObj[lastOpenedNote].history;
        }
    }
    return history;
};

/**
 * @returns Array of history items
 */
const getHistory = () => {
    const rawHistory = localStorage.getItem('history');
    const history = rawHistory === null ? [] : JSON.parse(rawHistory);
    return history;
};

/**
 * Add new history item to history array
 * and then update `history` item in localStorage
 */
const setHistory = () => {
    const history = getHistory();
    const historyItem = {
        'date': (new Date()),
        'text': rawText
    };
    history.unshift(historyItem);
    localStorage.setItem('history', JSON.stringify(history));
};

/**
 * Display history item markdown
 * @param {Node} item - History item for which markdown must be rendered
 */
const displayMarkdown = (item) => {

    const text = decodeURIComponent(escape(atob(item.getAttribute('data-text'))));
    const mdBody = item.children[1];
    const textarea = item.children[2];

    mdBody.innerHTML = converter.makeHtml(text);
    removeClass(mdBody, 'nodisplay');
    addClass(textarea, 'nodisplay');

};

/**
 * Display history item rawttext
 * @param {Node} item - History item for which textarea must be populated with rawtext
 */
const displayTextarea = (item) => {

    const text = decodeURIComponent(escape(atob(item.getAttribute('data-text'))));
    const mdBody = item.children[1];
    const textarea = item.children[2];

    addClass(mdBody, 'nodisplay');
    removeClass(textarea, 'nodisplay');
    textarea.innerHTML = text;

};

/**
 * Main revision history function
 */
const populateHistoryHtml = () => {

    let listElements = '';
    const history = lastOpenedNote === 'default' ? getHistory() : getNoteHistory();
    const length = history.length;

    history.map((item, id) => {
        const parsedDate = new Date(Date.parse(item.date));
        const formattedDate = `${(parsedDate.toDateString()).slice(4)}, ${(parsedDate.toTimeString()).slice(0,8)}`;
        const textBase64 = btoa(unescape(encodeURIComponent(item.text))); // Save rawtext as base64

        listElements +=
            `<div class='item' data-text='${textBase64}'>
                <div class='label flex'>
                    <div>
                        <p class='id'>#${length - id}</p>
                        <p class='date'>${formattedDate}</p>
                    </div>
                    <div class='noselect flex'>
                        <div class='button'>
                            <img class='nodrag' src='/assets/svg/bin.svg'/>
                        </div>
                        <div class='button'>
                            <img class='nodrag' src='/assets/svg/view.svg'/>
                        </div>
                    </div>
                </div>
                <div class='markdown-body'></div>
                <textarea class='nodisplay' readonly></textarea>
            </div>`;
    });

    getHtmlElement('section.history .list').innerHTML = listElements;

    /**
     * 1. Reverse order the array of `item`s to get in suitable, rawHistory adhering order
     * 2. Render each item's rawtext to markdown and display it
     * 3. Add event listeners to the buttons of the respective elements
     */
    [...document.querySelectorAll('section.history .item')].reverse().map((item, index) => {

        displayMarkdown(item);

        // Both variable gets mapped to respective elements
        const [deleteButton, viewButton] = item.children[0].children[1].children;

        deleteButton.addEventListener('click', () => {
            history.splice(length - index - 1, 1);
            if(lastOpenedNote === 'default')
                localStorage.setItem('history', JSON.stringify(history));
            else 
                setNoteHistory(history);
            populateHistoryHtml(); // Refresh the Revision History modal with updated content
        });
        viewButton.addEventListener('click', () => {
            item.children[2].classList.contains('nodisplay') ? displayTextarea(item) : displayMarkdown(item);
        });

    });

};

/**
 * @returns Settings object
 */
const getSettings = () => {
    const rawSettings = localStorage.getItem('settings');
    const settings = rawSettings === null ? null : JSON.parse(rawSettings);
    return settings;
};

/**
 * Change settings function
 * @param {String} key - Name of setting to be changed
 * @param {Boolean} value - Value of setting to be appied
 */
const setSettings = (key, value) => {
    let settings = getSettings();

    /**
     * If settings is null, page is opened for the first time thus
     * initialise with these defaults
     */

    if (settings === null || Object.keys(settings).length !== 5) {
        settings = {
            'saveHistory': true,
            'cursorLastPosition': true,
            'enablePowerMode': true,
            'PowerModeColor': false,
            'PowerModeShake': false
        };
    }

    else {
        settings[key] = value;
    }

    localStorage.setItem('settings', JSON.stringify(settings));
};

/**
 * Main settings handler function
 */
const settingsControl = () => {
    const settings = getSettings();
    const settingsItems = document.querySelectorAll('section.settings .item');

    [...settingsItems].map((item) => {
        const key = item.getAttribute('data-setting');
        const value = settings[key];

        // Toggle class on item and change switch style
        removeClass(item, value ? 'off' : 'on');
        addClass(item, value ? 'on' : 'off');

        // Using addEventListener does not work properly for some reason
        item.onclick = () => {
            setSettings(key, !value);
            settingsControl();
        };

    });

    applySettings();
};

/**
 * Finally, apply the settings that have been set
 */
const applySettings = () => {

    const settings = getSettings();

    // Save History
    saveHistory = settings.saveHistory;
    // Cursor at End of Document
    cursorLastPosition = settings.cursorLastPosition;
    // Enable POWER MODE
    settings.enablePowerMode ? textarea.addEventListener('input', POWERMODE, false) : textarea.removeEventListener('input', POWERMODE, false);
    // Colored POWER MODE
    POWERMODE.colorful = settings.PowerModeColor;
    // Shake on POWER MODE
    POWERMODE.shake = settings.PowerModeShake;

};

/**
 * Open modal
 * @param {Node} section - Modal element which is being opened
 * @param {Function} func - Function that will be performed if it exists
 */
const openModal = (section, func) => {

    // Mainly for `populateHistoryHtml` function
    func ? func() : null;

    // Add modal to activeModals only if it is not only present in the array (prevent double addition if button is clicked twice)
    activeModals.indexOf(section) === -1 ? activeModals.push(section) : null;

    // 1st modal to be opened
    if (activeModals.length === 1) {
        removeClass(section, 'z-index-3');
        addClass(section, 'z-index-2');
    }

    // 2nd modal to be opened
    else if (activeModals.length === 2) {
        removeClass(section, 'z-index-2');
        addClass(section, 'z-index-3');
    }

    removeClass(section, 'nodisplay');
    removeClass(mainSection, 'noblur');
    addClass(mainSection, 'blur');
    removeClass(dashboardSection, 'noblur');
    addClass(dashboardSection, 'blur');

    // Add eventListener to section.main to enable closing modal by clicking outside the modal
    if (!sectionMainEventListener) {
        sectionMainEventListener = true;
        mainSection.addEventListener('click', () => {
            return closeModal(activeModals);
        }, false);
    }

};

/**
 * Close modal
 * @param {Node} section - Modal element which is being closed
 */
const closeModal = (section) => {

    // If `section` is an Array pass elements of array through `closeModal`
    if (section.constructor === Array) {
        section.map(el => closeModal(el));
    }

    // If section is an HTML element
    else {
        // Remove modal from activeModals array
        activeModals.indexOf(section) !== -1 ? activeModals.splice(activeModals.indexOf(section), 1) : null;
        addClass(section, 'nodisplay');
    }

    // If all modals are closed unblur section.main
    if (activeModals.length === 0) {
        removeClass(mainSection, 'blur');
        addClass(mainSection, 'noblur');
        removeClass(dashboardSection, 'blur');
        addClass(dashboardSection, 'noblur');
    }

};

/**
 * Drag the revision modal with the header as the handle
 * Code borrowed and modified to es6 standards from:
 * https://www.w3schools.com/howto/howto_js_draggable.asp
 *
 * @param {String} name - name of modal to add draggability to
 */
const dragModal = (name) => {

    const el = getHtmlElement(`section.${name}`);
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();

        // Calculate new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Set element's new position
        el.style.top = (el.offsetTop - pos2) + 'px';
        el.style.left = (el.offsetLeft - pos1) + 'px';
    };

    const closeDragElement = () => {
        // Stop moving when mouse button is released
        document.removeEventListener('mouseup', closeDragElement, false);
        document.removeEventListener('mousemove', elementDrag, false);
    };

    const dragMouseDown = (e) =>{
        e = e || window.event;
        e.preventDefault();
        // Get mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('mouseup', closeDragElement, false);
        document.addEventListener('mousemove', elementDrag, false);
    };

    getHtmlElement(`section.${name} .header`).addEventListener('mousedown', dragMouseDown, false);

};

/**
 * Simple time-display function for the bottom bar
 */
const timeDisplay = () => {
    const timeEl = getHtmlElement('#time');
    setInterval(() => {
        const today = new Date();

        const day     = today.getDate()        < 10 ? '0' + today.getDate()        : today.getDate();
        const month   = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const year    = today.getFullYear()    < 10 ? '0' + today.getFullYear()    : today.getFullYear();
        const hour    = today.getHours()       < 10 ? '0' + today.getHours()       : today.getHours();
        const minute  = today.getMinutes()     < 10 ? '0' + today.getMinutes()     : today.getMinutes();
        const seconds = today.getSeconds()     < 10 ? '0' + today.getSeconds()     : today.getSeconds();

        const output = `${day}/${month}/${year} - ${hour}:${minute}:${seconds}`;
        timeEl.innerHTML = '&nbsp;-&nbsp;' + output;
    }, 1000);
};

/**
 * Main initiator function
 */
const initiate = () => {

    /**
     * First things first: Set and apply settings
     */
    setSettings();
    settingsControl();

    /**
     * Initiate the markdown renderer
     * with specified options
     *
     * TODO: Allow user to manually config
     * these options
     */
    converter = new showdown.Converter({
        'simplifiedAutoLink': true,
        'excludeTrailingPunctuationFromURLs': true,
        'strikethrough': true,
        'tables': true,
        'tasklist': true,
        'ghCodeBlocks': true,
        'smoothLivePreview': true,
        'smartIndentationFix': true,
        'simpleLineBreaks': true,
        'openLinksInNewWindow': true,
        'emoji': true
    });

    /**
     * GitHub-styled markdown to allow
     * tasklists, tables, simple-line-breaks etc.
     */
    converter.setFlavor('github');
    populateNotes();

    /*
    let noteName = 'Default';
    getHtmlElement('#name').innerHTML = `${noteName}`;

    let lastOpened = localStorage.getItem('lastOpened');
    if(lastOpened === null || lastOpened === 'default')
    {
        textarea.value = rawText === null ? `# Hello, world!\n\nStart editing right now by clicking the *edit* button or pressing <kbd>${navigator.platform.match('Mac') ? 'Cmd' : 'Ctrl'}</kbd> + <kbd>X</kbd>.\n\nTo save the file click the *save* button or press <kbd>${navigator.platform.match('Mac') ? 'Cmd' : 'Ctrl'}</kbd> + <kbd>S</kbd>.\n\nCheers!` : rawText;
        save();
    }
    else {
        const note = getNote(lastOpened);
        if(note !== null) {
            switchNote(note);
        }
    }
    */
    showDashboard();

    // Enable modal dragging
    dragModal('history');
    dragModal('settings');

    // Initiate time display in bottom bar
    timeDisplay();

    /**
     * Last edited: _______
     */
    setInterval(() => {
        let lastEdited = localStorage.getItem('lastEdited');
        if(lastOpenedNote !== 'default') {
            lastEdited = getNote(lastOpenedNote).lastEdited;
        }
        if(lastEdited == null)
            getHtmlElement('#lastEdited').innerHTML = 'Last edited: -';
        else
            getHtmlElement('#lastEdited').innerHTML = `Last edited: ${timeago().format(Date.parse(lastEdited))}`;
    }, 1000);

    /**
     * ***************
     * EVENT LISTENERS
     * ***************
     */

    /**
     * Add event listeners to edit, save and modal buttons
     */
    getHtmlElement('#edit')             .addEventListener('click', () => { edit();                                         }, false);
    getHtmlElement('#save')             .addEventListener('click', () => { save();                                         }, false);
    getHtmlElement('#lastEdited')       .addEventListener('click', () => { openModal(historySection, populateHistoryHtml); }, false);
    getHtmlElement('#closeHistory')     .addEventListener('click', () => { closeModal(historySection);                     }, false);
    getHtmlElement('#settings')         .addEventListener('click', () => { openModal(settingsSection, settingsControl);    }, false);
    getHtmlElement('#closeSettings')    .addEventListener('click', () => { closeModal(settingsSection);                    }, false);
    getHtmlElement('#settings-add')     .addEventListener('click', () => { openModal(notelistSection);                     }, false);
    getHtmlElement('#closeNotesAdd')    .addEventListener('click', () => { closeModal(noteaddSection);                     }, false);
    getHtmlElement('#closeNotesEdit')   .addEventListener('click',() =>  { closeModal(noteeditSection);                    }, false);
    getHtmlElement('#note-submit')      .addEventListener('click', () => { addNote();                                      }, false);
    getHtmlElement('#name')             .addEventListener('click', () => { editNoteMetaData();                             }, false);
    getHtmlElement('#settings-home')    .addEventListener('click', () => { showDashboard();                                }, false);

    /**
     * Capture keystrokes and perform respective functions:
     *
     * Ctrl + S => Save input (`save` function)
     * Ctrl + X => Edit input (`edit` function)
     *
     * Esc => Close Revision History modal
     */
    document.addEventListener('keydown', (e) => {
        // Control Key
        if (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) {
            if (e.keyCode === 83) {
                e.preventDefault();
                save();
            }
            else if (e.keyCode === 88) {
                // Allow for cutting text when textarea is on display
                if (textarea.classList.contains('nodisplay')) {
                    e.preventDefault();
                    edit();
                }
            }
        }
        // Escape key to close Revision History Modal
        else if (e.keyCode === 27) {
            // Close each modal one-by-one from the last opened to the first opened
            activeModals.length > 0 ? closeModal([...activeModals].pop()) : null;
        }
    }, false);

};

/* clicking on note name in footer, allows you to edit name of the note or delete it */
const editNoteMetaData= () => {
    closeModal(notelistSection); //close note list if open
    getHtmlElement('#notes-edit-header').innerHTML = 'Edit Note';
    if(lastOpenedNote === 'default') {
        alert('Default Note cannot be modifed!');
    }
    else {
        const note = getNote(lastOpenedNote);
        if(note === null) { return; }
        getHtmlElement('#note-edit-name').value = note.name;
        openModal(noteeditSection);

        getHtmlElement('#note-name-submit').addEventListener('click', () => {
            const name = getHtmlElement('#note-edit-name').value;
            if(checkForDuplicate(name, noteeditSection, '#notes-edit-header')) { return; }
            note.name = name;
            const notes = localStorage.getItem('notes');
            if(notes != null) {
                const notesObj = JSON.parse(notes);
                if(note.id in notesObj) {
                    notesObj[note.id] = note;
                }
                localStorage.setItem('notes', JSON.stringify(notesObj));
                switchNote(note);
            }
            closeModal(noteeditSection);
            populateNotes();
        });
        getHtmlElement('#note-delete').addEventListener('click', () => {
            note.name = getHtmlElement('#note-edit-name').value;
            const notes = localStorage.getItem('notes');
            if(notes != null) {
                const notesObj = JSON.parse(notes);
                if(note.id in notesObj) {
                    delete notesObj[note.id];
                    localStorage.setItem('notes', JSON.stringify(notesObj));
                    switchToDefaultNote();
                }
            }
            closeModal(noteeditSection);
            populateNotes();
        });

    }
};

/* populate the sidebar with the notes we have so far */
const populateNotes = () => {
    let listElements = '';
    let notes = localStorage.getItem('notes');
    [...document.querySelectorAll('section.notelist .item')].reverse().map((item, _index) => {
        if(item.getAttribute('data-setting') === 'note') {
            item.remove();
        }
    });
    if(notes !== null && notes.length > 0) {
        notes = JSON.parse(notes);
        Object.keys(notes).map(function(key, _index) {
            const name = notes[key].name;
            const id = notes[key].id;
            listElements += `<div class="item flex" data-setting="note" id=${id}><div class="main flex"><label>${name}</label></div></div>`;
        });
    }

    getHtmlElement('section.notelist').innerHTML += listElements;
    [...document.querySelectorAll('section.notelist .item')].reverse().map((item, _index) => {
        if(item.getAttribute('data-setting') === 'note') {
            item.addEventListener('click', () => {
                const note = getNote(item.id);
                if(note !== null) {
                    switchNote(note);
                }
                else {
                    alert('Error Fetching Note with name: ' + item.innerHTML);
                }
            });
        }
        else if(item.id == 'notelist-default') {
            item.addEventListener('click', () => {
                switchToDefaultNote();
            });
        }
    });
    getHtmlElement('#notelist-add-note').addEventListener('click', () => { 
        openModal(noteaddSection, hideNoteAddSection);}, false);
};

/* hide note addSection */
const hideNoteAddSection = () => {
    closeModal(notelistSection);
    getHtmlElement('#notes-add-header').innerHTML = 'Add Note';
    getHtmlElement('#note-add-name').value = '';
};

/* switches to default note */
const switchToDefaultNote = () => {
    let note = {};
    note.id = 'default';
    note.name = 'Default';
    note.rawText = localStorage.getItem('rawText');
    switchNote(note);
};

/* switches to a note defined in `note` can switch by note.id or to default via switchToDefaultNote 
 * @param {Object} note - Object defining the note
 * @param {Boolean} editmode - open in edit mode or rendered mode
*/
const switchNote = (note, editmode = false) => {
    lastOpenedNote = note.id;
    textarea.value = note.rawText;
    getHtmlElement('#name').innerHTML = `${note.name}`;
    if(editmode)
        edit();
    else
        show();
    hideNoteAddSection();
    localStorage.setItem('lastOpened', lastOpenedNote);
    removeClass(mainSection, 'nodisplay');
    addClass(dashboardSection, 'nodisplay');
};

/* this variable tracks which note is open, if its default the data is read from localstorage.{rawText|lastEdited|history}, 
   if its anything else we look for notes section in localstorage and try to find the note based on the value of this variable.
*/
var lastOpenedNote = 'default';

/* create a new note functionality, creates `notes` section in localStorage if its not present */
const addNote = () => {
    const name = getHtmlElement('#note-add-name').value;
    let notes = localStorage.getItem('notes');
    if(notes === null) { notes = {}; }
    else { notes = JSON.parse(notes); }
    if(name !== null && name.length > 0 ) {
        if(checkForDuplicate(name, noteaddSection, '#notes-add-header')) { return; }
        const note = {};
        note.name = name;
        note.id = 'note_id_' + (new Date().getTime());
        note.rawText = 'Click to start editing!';
        note.history = [];
        note.lastEdited = new Date();
        notes[note.id] = note;
        localStorage.setItem('notes', JSON.stringify(notes));
        closeModal(noteaddSection);
        switchNote(note, true);
        populateNotes();
    }
};

/* searches the note object to see if the name is already used 
 * @param {string} name - name of the note to search
 * @return {Boolean} if the name is duplicate return true 
*/

const checkForDuplicate = (name, el = null, headerId = '') => {
    let notes = localStorage.getItem('notes');
    if(notes !== null && notes.length > 0) {
        notes = JSON.parse(notes);
        for(let i = 0; i < Object.keys(notes).length; i += 1)
        {
            const key = Object.keys(notes)[i];
            const notename = notes[key].name;
            if(name.toLowerCase().localeCompare(notename.toLowerCase()) == 0) {
                if(headerId !== '')
                    getHtmlElement(headerId).innerHTML = '<span style=\'color:red\'>Duplicate Name!!</span>';
                if(el !== null)
                    localShake(el, 10);
                return true;
            }
        }
    }
    return false;
};

/* copied from PowerMode.Shake, shakes the element sent as input */
const localShake = (el,  i) => {
    var intensity = i + 2 * Math.random();
    var x = intensity * (Math.random() > 0.5 ? -1 : 1);
    var y = intensity * (Math.random() > 0.5 ? -1 : 1);
    el.style.marginLeft = x + 'px';
    el.stylemarginTop = y + 'px';
    setTimeout(function() {
        el.style.marginLeft = '';
        el.style.marginTop = '';
    }, 75);
};

const showDashboard = () => {
    removeClass(dashboardSection, 'nodisplay');
    addClass(mainSection, 'nodisplay');
    getHtmlElement('#name').innerHTML = 'Dashboard';
    const className = 'markdown-body markdown-preview';
    let notes = localStorage.getItem('notes');
    if(notes != null && notes.length > 0) {
        while(dashboardSection.firstChild)
            dashboardSection.removeChild(dashboardSection.firstChild);
        var div = document.createElement('div');
        div.className = className;
        div.innerHTML = converter.makeHtml(localStorage.getItem('rawText'));
        dashboardSection.appendChild(div);
        //add notes
        notes = JSON.parse(notes);
        Object.keys(notes).map(function(key, _index) {
            //const name = notes[key].name;
            //const id = notes[key].id;
            var div = document.createElement('div');
            div.className = className;
            div.innerHTML = converter.makeHtml(notes[key].rawText);
            dashboardSection.appendChild(div);
        });
        //add default note
    }
    else {
        //if no notes object and only default note, switch to default
        switchToDefaultNote();
    }
};
/**
 * INITIATE!!!
 */
(() => {
    initiate();
})();