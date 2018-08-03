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
 * Declare global variables
 */
const renderBox                = getHtmlElement('.markdown-body');
const textarea                 = getHtmlElement('textarea');
const mainSection              = getHtmlElement('section.main');
const historySection           = getHtmlElement('section.history');
const settingsSection          = getHtmlElement('section.settings');
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
const moveCaretToStart = () => {

    if (typeof textarea.selectionStart === 'number') {
        textarea.selectionStart = textarea.selectionEnd = 0;
    }

    else if (typeof textarea.createTextRange !== 'undefined') {
        textarea.focus();
        const range = textarea.createTextRange();
        range.collapse(true);
        range.select();
    }

};

// Main edit function
const edit = () => {

    toggleDisplay(1);
    textarea.focus();

    if (cursorLastPosition) {
        textarea.selectionStart = Number(localStorage.getItem('cursorLastPosition'));
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

    localStorage.setItem('cursorLastPosition', textarea.selectionStart);

    toggleDisplay(0);
    const text = textarea.value;
    const html = converter.makeHtml(text);
    renderBox.innerHTML = html;

    if (html !== converter.makeHtml(rawText)) {
        localStorage.setItem('rawText', text);
        rawText = text;
        if (saveHistory) {
            localStorage.setItem('lastEdited', (new Date()));
            setHistory();
        }
    }

    // Toggle button display
    removeClass(getHtmlElement('#edit'), 'nodisplay');
    addClass(getHtmlElement('#save'), 'nodisplay');

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
    const history = getHistory();
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
            localStorage.setItem('history', JSON.stringify(history));
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
            'enablePowerMode': false,
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
        timeEl.innerHTML = output;
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

    /**
     * 1. Get `rawText` from localStorage and populate textarea with it
     * 2. Initiate first `save` to render markdown
     */
    textarea.value = rawText === null ? `# Hello, world!\n\nStart editing right now by clicking the *edit* button or pressing <kbd>${navigator.platform.match('Mac') ? 'Cmd' : 'Ctrl'}</kbd> + <kbd>X</kbd>.\n\nTo save the file click the *save* button or press <kbd>${navigator.platform.match('Mac') ? 'Cmd' : 'Ctrl'}</kbd> + <kbd>S</kbd>.\n\nCheers!` : rawText;
    save();

    // Enable modal dragging
    dragModal('history');
    dragModal('settings');

    // Initiate time display in bottom bar
    timeDisplay();

    /**
     * Last edited: _______
     */
    setInterval(() => {
        getHtmlElement('#lastEdited').innerHTML = `Last edited: ${timeago().format(Date.parse(localStorage.getItem('lastEdited')))}`;
    }, 1000);

    /**
     * ***************
     * EVENT LISTENERS
     * ***************
     */

    /**
     * Add event listeners to edit, save and modal buttons
     */
    getHtmlElement('#edit')         .addEventListener('click', () => { edit();                                         }, false);
    getHtmlElement('#save')         .addEventListener('click', () => { save();                                         }, false);
    getHtmlElement('#lastEdited')   .addEventListener('click', () => { openModal(historySection, populateHistoryHtml); }, false);
    getHtmlElement('#closeHistory') .addEventListener('click', () => { closeModal(historySection);                     }, false);
    getHtmlElement('#settings')     .addEventListener('click', () => { openModal(settingsSection, settingsControl);    }, false);
    getHtmlElement('#closeSettings').addEventListener('click', () => { closeModal(settingsSection);                    }, false);

    /**
     * Capture keystrokes and perform respective functions:
     *
     * Ctrl + S => Save input (`save` function)
     * Ctrl + X => Edit input (`edit` function)
     *
     * Esc => Close modals
     */
    document.addEventListener('keydown', (e) => {
        // Control Key
        if (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) {
            if (e.keyCode === 83 && renderBox.classList.contains('nodisplay')) {
                e.preventDefault();
                save();
            }
            else if (e.keyCode === 88 && textarea.classList.contains('nodisplay')) {
                e.preventDefault();
                edit();
            }
        }
        // Escape key to close modals
        else if (e.keyCode === 27) {
            // Close each modal one-by-one from the last opened to the first opened
            activeModals.length > 0 ? closeModal([...activeModals].pop()) : null;
        }
    }, false);

    /**
     * "Auto-save" on tab change when tab is
     *  unfocused and edit mode is active
     */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && renderBox.classList.contains('nodisplay')) {
            save();
            edit();
            textarea.selectionStart = Number(localStorage.getItem('cursorLastPosition'));
        }
    });

};

/**
 * INITIATE!!!
 */
(() => {
    initiate();
})();
