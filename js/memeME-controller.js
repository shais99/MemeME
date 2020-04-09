'use strict';

var gCanvas;
var gCtx;

function onSelectMeme(imgId) {
    initCanvas(imgId);
    setCurrMeme(imgId);
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

function onMoveSelected(ev) {
    if (ev.which !== 1) return;

    const offsetX = ev.offsetX
    const offsetY = ev.offsetY

    
}

function onChangeSelected(ev) {

    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    var selectedLine = findClickedLine(offsetX, offsetY)
    const lines = getLines();

    if (!selectedLine) return;

    var selectedLineIdx = lines.findIndex(line => {
        return line.id === selectedLine.id;
    })

    gMeme.selectedLineIdx = selectedLineIdx
    renderMeme(gMeme.selectedImgId)
    setCurrTextInput();
}

function onDownloadMeme(elLink) {
    renderMeme(gMeme.selectedImgId, true)
    var imgContent = gCanvas.toDataURL();
    elLink.href = imgContent
}

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
    renderMeme(gMeme.selectedImgId);
}

function onTextAlign(alignTo) {
    if (gMeme.lines.length <= 0) return;
    textAlign(alignTo);
    renderMeme(gMeme.selectedImgId);
}

function onAddLine() {
    addLine();
    renderMeme(gMeme.selectedImgId);

    gMeme.selectedLineIdx = gMeme.lines.length - 1
    setCurrTextInput();
}

function onSwitchLine() {
    if (gMeme.lines.length <= 0) return;
    switchLine();
    renderMeme(gMeme.selectedImgId)
}

function onMoveLine(diff) {
    if (gMeme.lines.length <= 0) return;
    moveLine(diff);
    renderMeme(gMeme.selectedImgId);
}

function onUpdateFontSize(diff) {
    if (gMeme.lines.length <= 0) return;
    updateFontSize(diff);
    renderMeme(gMeme.selectedImgId);
}

function onChangeValue(el) {
    if (gMeme.lines.length <= 0) return;
    updateText(el.value);
    renderMeme(gMeme.selectedImgId);
}

function setCurrTextInput() {
    const elMemeText = document.querySelector('input[name="meme-text"]');
    elMemeText.value = gMeme.lines[gMeme.selectedLineIdx].text
}

function renderMeme(imgId, isDownload = false) {
    const imgs = getImgs();
    const foundImg = imgs.find(img => {
        return imgId === img.id;
    })
    var img = new Image();
    img.src = foundImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);

        let lines = getLines();
        lines.forEach((line, idx) => {
            setCanvasText(line.text, line.xPosition, line.yPosition, undefined, undefined, line.size);
            let measure = gCtx.measureText(line.text)
            setLineSize(idx, measure.width, measure.actualBoundingBoxAscent)
            if (!isDownload) markLine();
        })

    }
}

function markLine() {
    let currLine = getCurrLine()
    gCtx.beginPath()
    gCtx.fillStyle = 'rgba(36, 35, 35, 0.35)';
    gCtx.lineWidth = 3
    gCtx.rect(currLine.xPosition - 10, currLine.yPosition - currLine.height - 5, currLine.width + 15, currLine.height + 15);
    gCtx.stroke()
    gCtx.fill()
}

function renderImgs(imgsToRender) {
    if (!imgsToRender) var imgsToRender = getImgs();

    const elImgsContainer = document.querySelector('.imgs-container');

    var strHTML = imgsToRender.map(img => {
        return `<img src="${img.url}" onclick="onSelectMeme(${img.id})" alt="${img.name}" title="${img.name}" />`
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
    renderMeme(imgId);
}