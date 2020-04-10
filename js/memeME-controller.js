'use strict';

var gCanvas;
var gCtx;
var gSavedMemes = loadFromStorage(KEY)
const gElCanvas = document.querySelector('#make-meme');
var gIsText = true;
var gIsMovingText = false;

function onSelectMeme(imgId) {
    initCanvas(imgId);
    setCurrMeme(imgId);
    setCurrTextInput();
    // listenResize();
}

function onInit() {
    createImgs();
    renderImgs();
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

gElCanvas.addEventListener('mousedown', ev => {
    if (gIsText) gIsMovingText = true
})

gElCanvas.addEventListener('mousemove', ev => {
    if (!gIsMovingText) return;
    var currLine = gMeme.lines[gMeme.selectedLineIdx]
    currLine.xPosition = ev.offsetX / 2
    currLine.yPosition = ev.offsetY
    renderMeme(gMeme.selectedImgId)
})

gElCanvas.addEventListener('mouseup', ev => {
    gIsMovingText = false;
})



function onChangeFontColor() {
    const fontColorInput = document.querySelector('input[name="font-color"]');
    changeFontColor(fontColorInput.value);
    renderMeme(gMeme.selectedImgId)
}

function onOpenChangeColor() {
    const fontColorInput = document.querySelector('input[name="font-color"]');
    fontColorInput.click();
}

function onCloseModal() {
    document.querySelector('.modal').style.display = 'none';
}

function onOpenModal(modalType) {
    document.querySelector('.modal').style.display = 'block';
    const elModalTitle = document.querySelector('.modal-title');

    if (modalType === 'save') {
        elModalTitle.innerHTML = `Your meme saved`;
    }
}

function clearMark() {
    renderMeme(gMeme.selectedImgId, true)
}

function onSaveMeme(ev) {
    if (ev.which === 3) return;

    onOpenModal('save');
    setTimeout(onCloseModal, 2000);

    let imgContent = gCanvas.toDataURL();
    if (!gSavedMemes || !gSavedMemes.length) gSavedMemes = []

    gSavedMemes.push({ imgContent, id: makeId(), meme: gMeme });
    saveToStorage(KEY, gSavedMemes)
}

function onChangeSelected(ev) {

    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    var selectedLine = findClickedLine(offsetX, offsetY)
    if (!selectedLine) return;
    gIsText = true;

    const lines = getLines();
    var selectedLineIdx = lines.findIndex(line => {
        return line.id === selectedLine.id;
    })

    gMeme.selectedLineIdx = selectedLineIdx
    renderMeme(gMeme.selectedImgId)
    setCurrTextInput();
}

function onDownloadMeme(elLink) {
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
            setCanvasText(line.text, line.xPosition, line.yPosition, line.color, undefined, line.size);
            let measure = gCtx.measureText(line.text)
            setLineSize(idx, measure.width, measure.actualBoundingBoxAscent)
        })
        if (!isDownload) markLine();

    }
}

function markLine() {
    let currLine = getCurrLine()
    gCtx.beginPath()
    gCtx.fillStyle = 'rgba(255, 0, 0, 0.1)';
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


    if (window.outerWidth < 615) resizeCanvas(300, 300);
    else resizeCanvas(500, 500);

    renderMeme(imgId);
}