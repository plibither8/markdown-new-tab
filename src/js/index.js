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
const renderBox = getHtmlElement('.markdown-body');
const textarea = getHtmlElement('textarea');
const mainSection = getHtmlElement('section.main');
const historySection = getHtmlElement('section.history');
let rawText = localStorage.getItem('rawText');
let sectionMainEventListener; // section.main eventListener (defined in `openModal` function)
let converter; // Main markdown rendering converter (defined in `initiate` function)

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
    moveCaretToStart();
    textarea.focus();
    textarea.scrollTop = 0;

};

// Main save function
const save = () => {

    toggleDisplay(0);
    const text = textarea.value;
    const html = converter.makeHtml(text);
    renderBox.innerHTML = html;

    if (html !== converter.makeHtml(rawText)) {
        localStorage.setItem('rawText', text);
        localStorage.setItem('lastEdited', (new Date()));
        rawText = text;
        setHistory();
    }

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
    [...document.querySelectorAll('.item')].reverse().map((item, index) => {

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

// Open revision history modal
const openModal = () => {

    populateHistoryHtml();

    removeClass(historySection, 'nodisplay');
    mainSection.style.filter = 'blur(3px)';

    // Add eventListener to section.main to enable closing modal by clicking outside the modal
    if (sectionMainEventListener === undefined) {
        sectionMainEventListener = mainSection.addEventListener('click', closeModal, false);
    }

};

// Close revision history modal
const closeModal = () => {
    addClass(historySection, 'nodisplay');
    mainSection.style.filter = 'blur(0px)';

    // Remove eventListener once the modal has been closed
    mainSection.removeEventListener('click', closeModal, false);
};

/**
 * Drag the revision modal with the header as the handle
 * Code borrowed and modified to es6 standards from:
 * https://www.w3schools.com/howto/howto_js_draggable.asp
 */
const dragModal = () => {
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
        historySection.style.top = (historySection.offsetTop - pos2) + 'px';
        historySection.style.left = (historySection.offsetLeft - pos1) + 'px';
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

    getHtmlElement('section.history .header').addEventListener('mousedown', dragMouseDown, false);

};

/**
 * Simple time-display function for the bottom bar
 */
const timeDisplay = () => {
    setInterval(() => {
        const today = new Date();

        const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const year = today.getFullYear() < 10 ? '0' + today.getFullYear() : today.getFullYear();
        const hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
        const minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        const seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

        const output = `${day}/${month}/${year} - ${hour}:${minute}:${seconds}`;

        getHtmlElement('#time').innerHTML = output;

    }, 1000);
};

/**
 * Main initiator function
 */
const initiate = () => {

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
    textarea.value = rawText === null ? '# Hello, world!\n\nStart editing right now by clicking the *edit* button or pressing <kbd>Ctrl</kbd> + <kbd>X</kbd>.\n\nCheers!' : rawText;
    save();

    // Enable modal dragging
    dragModal();

    // Initiate time display in bottom bar
    timeDisplay();

    /**
     * Last edited: _______
     */
    setInterval(() => {
        getHtmlElement('#lastEdited').innerHTML = `Last edited: ${timeago().format(Date.parse(localStorage.getItem('lastEdited')))}`;
    }, 1000);

    /**
     * Configure POWERMODE
     */
    POWERMODE.shake = false; // Disable shaking (too much of a distraction IMO)
    POWERMODE.colorful = true;

    /**
     * ***************
     * EVENT LISTENERS
     * ***************
     */

    /**
     * Add event listeners to edit, save and modal buttons
     */
    getHtmlElement('#edit').addEventListener('click', () => {edit();}, false);
    getHtmlElement('#save').addEventListener('click', () => {save();}, false);
    getHtmlElement('#close').addEventListener('click', () => {closeModal();}, false);
    getHtmlElement('#lastEdited').addEventListener('click', () => {openModal();}, false);

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
                e.preventDefault();
                edit();
            }
        }
        // Escape key to close Revision History Modal
        else if (e.keyCode === 27) {
            addClass(historySection, 'nodisplay');
        }
    }, false);

    // Add POWERMODE function on input of textarea
    textarea.addEventListener('input', POWERMODE);

};

/**
 * INITIATE!!!
 */
(() => {
    initiate();
})();