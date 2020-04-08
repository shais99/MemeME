'use strict';

var gCanvas;
var gCtx;

function onSelectMeme(imgId) {
    setCurrMeme(imgId);
    initCanvas(imgId);
    setCurrTextInput();
}

function onInit() {
    createImgs();
    renderImgs();
    // listenResize();
}

// function listenResize() {
//     window.addEventListener('resize', () => {
//         // gCanvas.width = window.innerWidth
//         // gCanvas.height = window.innerHeight
//         console.log('gCanvas width', gCanvas.width);
//         console.log('gCanvas height', gCanvas.height);

//         console.log('window innerWidth', window.innerWidth);
//         console.log('window innerHeight', window.innerHeight);

//     })
// }

function onSearchBy(value) {
    searchBy(value);
    if (!value) gSearchByImgs = getImgs();
    renderImgs(gSearchByImgs);
}

function onChangeSearchText(searchText) {
    const elSearchInput = document.querySelector('input[name="search-input"]');
    elSearchInput.placeholder = searchText;
}

function onDeleteLine() {
    if (gMeme.lines.length <= 0) return;
    deleteLine();
    setMeme(gMeme.selectedImgId);
}

function onTextAlign(alignTo) {
    if (gMeme.lines.length <= 0) return;
    textAlign(alignTo);
    setMeme(gMeme.selectedImgId);
}

function onChangeSelected(ev) {

    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    console.log(offsetX);
    console.log(offsetY);

    // var clickedLine = gMeme.lines.find(line => {
    //     return offsetX > line.xPosition
    //         && offsetX < line.xPosition
    //         && offsetY > line.yPosition
    //         && offsetY < gCanvas.height
    // });
}

function onAddLine() {
    addLine();
    setMeme(gMeme.selectedImgId);

    gMeme.selectedLineIdx = gMeme.lines.length - 1
    setCurrTextInput();
}

function onSwitchLine() {
    if (gMeme.lines.length <= 0) return;
    switchLine();
}

function onMoveLine(diff) {
    if (gMeme.lines.length <= 0) return;
    moveLine(diff);
    setMeme(gMeme.selectedImgId);
}

function onChangeFontSize(diff) {
    if (gMeme.lines.length <= 0) return;
    updateFontSize(diff);
    setMeme(gMeme.selectedImgId);
}

function onChangeValue(el) {
    if (gMeme.lines.length <= 0) return;
    updateText(el.value);
    setMeme(gMeme.selectedImgId);
}

function setCurrTextInput() {
    const elMemeText = document.querySelector('input[name="meme-text"]');
    elMemeText.value = gMeme.lines[gMeme.selectedLineIdx].text
}

function renderImgs(imgsToRender) {
    if (!imgsToRender) var imgsToRender = getImgs();

    const elImgsContainer = document.querySelector('.imgs-container');

    var strHTML = imgsToRender.map(img => {
        return `
        <img src="${img.url}" onclick="onSelectMeme(${img.id})" alt="${img.name}" title="${img.name}" />
        `
    })

    elImgsContainer.innerHTML = strHTML.join('');
    gSearchByImgs = []
}

function initCanvas(imgId) {
    const elImgsContainer = document.querySelector('.imgs-container');
    elImgsContainer.style.display = 'none';

    const elSearchBy = document.querySelector('.search-by');
    elSearchBy.style.display = 'none';

    const elMemeContainer = document.querySelector('.make-meme-container');
    elMemeContainer.style.display = 'flex';

    gCanvas = document.querySelector('#make-meme');
    gCtx = gCanvas.getContext('2d');

    resizeCanvas();
    setMeme(imgId);
}