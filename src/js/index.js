/**
 * Initiate the markdown renderer
 * with specified options
 *
 * TODO: Allow user to manually config
 * these options
 */
const converter = new showdown.Converter({
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
 *
 */
const renderBox = document.querySelector('.markdown-body');
const textarea = document.querySelector('textarea');

const toggleDisplay = (n) => {

    if (n) {
        textarea.classList.remove('nodisplay');
        renderBox.classList.add('nodisplay');
    }

    else {
        textarea.classList.add('nodisplay');
        renderBox.classList.remove('nodisplay');
    }

}

const moveCaretToStart = () => {

    if (typeof textarea.selectionStart === "number") {
        textarea.selectionStart = textarea.selectionEnd = 0;
    }

    else if (typeof textarea.createTextRange !== "undefined") {
        textarea.focus();
        const range = textarea.createTextRange();
        range.collapse(true);
        range.select();
    }

}

const edit = () => {

    toggleDisplay(1);
    moveCaretToStart();
    textarea.focus();
    textarea.scrollTop = 0

};

const save = () => {

    toggleDisplay(0);

    const text = textarea.value;
    const html = converter.makeHtml(text);

    renderBox.innerHTML = html;
    localStorage.setItem("rawText", text);

}

const rawText = localStorage.getItem("rawText");
textarea.value = rawText;
save();

textarea.addEventListener('input', () => {
    text = textarea.value;
    html = converter.makeHtml(text);
    renderBox.innerHTML = html;
})

const editButton = document.querySelector('#edit');
const saveButton = document.querySelector('#save');

editButton.addEventListener('click', edit);
saveButton.addEventListener('click', save);

document.addEventListener("keydown", (e) => {
    if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
        if (e.keyCode === 83) {
            e.preventDefault();
            save();
        }
        else if (e.keyCode === 69) {
            e.preventDefault();
            edit();
        }
    }
}, false);



const timeDisplay = () => {

    setInterval(function () {

        const today = new Date();
        const day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
        const month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
        const year = today.getFullYear() < 10 ? "0" + today.getFullYear() : today.getFullYear();

        const hour = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
        const minute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

        const output = day + '/' + month + '/' + year + ' - ' +
            hour + ':' + minute + ':' + seconds;

        document.querySelector('#time').innerHTML = output;

    }, 1000);

};

timeDisplay();


POWERMODE.shake = false;
POWERMODE.colorful = true;
textarea.addEventListener('input', POWERMODE);