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

const renderBox = document.querySelector('.text');
const textarea = document.querySelector('textarea');

textarea.addEventListener('input', () => {
    text = textarea.value;
    html = converter.makeHtml(text);
    renderBox.innerHTML = html;
})