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

converter.setFlavor('github');

const edit = () => {
    textarea.classList.remove('nodisplay');
    renderBox.classList.add('nodisplay');
    textarea.focus();
};

const save = () => {
    textarea.classList.add('nodisplay');
    renderBox.classList.remove('nodisplay');
    text = textarea.value;
    html = converter.makeHtml(text);
    renderBox.innerHTML = html;
    localStorage.setItem("rawText", text);
}

const renderBox = document.querySelector('.markdown-body');
const textarea = document.querySelector('textarea');
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
    if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        save();
    }
}, false);

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 69 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        edit();
    }
}, false);