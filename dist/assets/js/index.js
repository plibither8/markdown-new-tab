'use strict';

/**
 * **********************************************
 * MARKDOWN RENDER, TOGGLE DISPLAY AND SAVE INPUT
 * **********************************************
 */

/**
 * Initiate the markdown renderer
 * with specified options
 *
 * TODO: Allow user to manually config
 * these options
 */
var converter = new showdown.Converter({
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

var renderBox = document.querySelector('.markdown-body');
var textarea = document.querySelector('textarea');

/**
 * Toggle between renderBox and textarea
 * @param n - If n = 1, display renderBox, else display textarea
 */
var toggleDisplay = function toggleDisplay(n) {

    if (n) {
        textarea.classList.remove('nodisplay');
        renderBox.classList.add('nodisplay');
    } else {
        textarea.classList.add('nodisplay');
        renderBox.classList.remove('nodisplay');
    }
};

/**
 * Move the textarea caret to the start of the
 * line instead of the last line so that it is visible
 * From https://stackoverflow.com/a/8190890/
 */
var moveCaretToStart = function moveCaretToStart() {

    if (typeof textarea.selectionStart === "number") {
        textarea.selectionStart = textarea.selectionEnd = 0;
    } else if (typeof textarea.createTextRange !== "undefined") {
        textarea.focus();
        var range = textarea.createTextRange();
        range.collapse(true);
        range.select();
    }
};

// Main edit function
var edit = function edit() {

    toggleDisplay(1);
    moveCaretToStart();
    textarea.focus();
    textarea.scrollTop = 0;
};

// Main save function
var save = function save() {

    toggleDisplay(0);

    var text = textarea.value;
    var html = converter.makeHtml(text);

    renderBox.innerHTML = html;
    localStorage.setItem("rawText", text);
};

/**
 * Get `rawText` from localStorage and populate textarea with it
 */
var rawText = localStorage.getItem("rawText");
textarea.value = rawText;
save();

/**
 * Add event listeners to edit and save buttons
 */
document.querySelector('#edit').addEventListener('click', edit);
document.querySelector('#save').addEventListener('click', save);

/**
 * Capture keystrokes and perform respective functions:
 * 
 * Ctrl + S => Save input (`save` function)
 * Ctrl + E => Edit input (`edit` function)
 */
document.addEventListener("keydown", function (e) {
    if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
        if (e.keyCode === 83) {
            e.preventDefault();
            save();
        } else if (e.keyCode === 69) {
            e.preventDefault();
            edit();
        }
    }
}, false);

/**
 * **************************
 * BOTTOM BAR FUNCTIONALITIES
 * **************************
 */

/**
 * Simple time-display function for the bottom bar
 */
var timeDisplay = function timeDisplay() {

    setInterval(function () {

        var today = new Date();
        var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
        var month = today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
        var year = today.getFullYear() < 10 ? "0" + today.getFullYear() : today.getFullYear();

        var hour = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
        var minute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

        var output = day + '/' + month + '/' + year + ' - ' + hour + ':' + minute + ':' + seconds;

        document.querySelector('#time').innerHTML = output;
    }, 1000);
};

timeDisplay();

/**
 * *********
 * POWERMODE
 * *********
 */

POWERMODE.shake = false; // Disable shaking (too much of a distraction IMO)
POWERMODE.colorful = true;
textarea.addEventListener('input', POWERMODE); // Add POWERMODE function to input.