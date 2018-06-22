const converter = new showdown.Converter();

const renderBox = document.querySelector('.text');
const textarea = document.querySelector('textarea');

textarea.addEventListener('input', () => {
    text = textarea.value;
    html = converter.makeHtml(text);
    renderBox.innerHTML = html;
})