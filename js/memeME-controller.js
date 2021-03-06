'use strict';

var gCanvas;
var gCtx;
var gSavedMemes = loadFromStorage(KEY)
const gElCanvas = document.querySelector('#make-meme');
var gIsText = true;
var gIsMovingText = false;
var gIsUpload = false;
var gUploadSrc;
var gCurrInputValue;
var gIsInlineEdit = false;
const EMPTY_TEXT = 'It\'s empty.'
const MOBILE_SIZE = 615;

function renderCanvas(imgId) {
    if (!gIsUpload) {
        initCanvas(imgId)
        setCurrMeme(imgId)
    } else {
        initCanvas();
        setCurrMeme();
    }
    setCurrTextInput();
    if (window.outerWidth < MOBILE_SIZE) {
        changeByRes();
        doubleTapEdit();
        pinchOut();
    }
    dragAndDrop();
    touchEvent();
}

function initCanvas(imgId) {
    renderPageCanvas();
    renderMeme(imgId);
}

// function onSelectMeme(imgId) {
//     initCanvas(imgId);
//     setCurrMeme(imgId);
//     setCurrTextInput();
//     if (window.outerWidth < 615) {
//         changeByRes();
//         doubleTapEdit();
//         pinchOut();
//     }
//     dragAndDrop();
//     touchEvent();
// }

// function renderUpload() {
//     renderPageCanvas();
//     setCurrMeme();
//     setCurrTextInput();
//     if (window.outerWidth < 615) {
//         changeByRes();
//         doubleTapEdit();
//         pinchOut();
//     } 
//     dragAndDrop();
//     touchEvent();
// }

function onInit() {
    createImgs();
    renderImgs();
}

function onUploadImg(ev) {
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        gUploadSrc = img.src
        gIsUpload = true
        renderCanvas();
        renderMeme();
    }

    // const maxAllowedSize = 1024 * 250
    // if (ev.target.files[0].size > maxAllowedSize) {
    //     alert('Your File Is Too Big, Please Select Another One!');
    // } else {
    reader.readAsDataURL(ev.target.files[0]);
    // }
}

function onChangeFontColor() {
    const fontColorInput = document.querySelector('input[name="font-color"]');
    changeFontColor(fontColorInput.value);
    let meme = getMeme();
    renderMeme(meme.selectedImgId)
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
    let meme = getMeme();
    renderMeme(meme.selectedImgId, true)
}

function onSaveMeme(ev) {
    if (ev.which === 3) return;

    onOpenModal('save');
    setTimeout(onCloseModal, 2000);

    let imgContent = gCanvas.toDataURL();
    console.log(imgContent);

    if (!gSavedMemes || !gSavedMemes.length) gSavedMemes = []

    let meme = getMeme();
    gSavedMemes.push({ imgContent, id: makeId(), meme });
    saveToStorage(KEY, gSavedMemes)
}

function onChangeSelected(ev) {

    if (gIsInlineEdit) return;

    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    var selectedLine = findClickedLine(offsetX, offsetY)
    if (!selectedLine) return;
    gIsText = true;

    const lines = getLines();
    var selectedLineIdx = lines.findIndex(line => {
        return line.id === selectedLine.id;
    })
    let meme = getMeme();

    meme.selectedLineIdx = selectedLineIdx
    renderMeme(meme.selectedImgId)
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

function onDeleteLine() {
    let meme = getMeme();
    if (meme.lines.length <= 0) return;
    deleteLine();
    renderMeme(meme.selectedImgId);
}

function onTextAlign(alignTo) {
    let meme = getMeme();
    if (meme.lines.length <= 0) return;
    textAlign(alignTo);
    renderMeme(meme.selectedImgId);
}

function onAddLine() {
    var xPosition = gCanvas.width / 2 - 72;
    var lineSize = 40;
    if (window.outerWidth < MOBILE_SIZE) {
        xPosition = 85
        lineSize = 30
    }
    addLine(xPosition, lineSize)
    let meme = getMeme();
    renderMeme(meme.selectedImgId);
    meme.selectedLineIdx = meme.lines.length - 1
    setCurrTextInput();

}

function onSwitchLine() {
    let meme = getMeme();
    if (meme.lines.length <= 0) return;
    switchLine();
    renderMeme(meme.selectedImgId)
}

function onMoveLine(diff) {
    let meme = getMeme();
    if (meme.lines.length <= 0) return;
    moveLine(diff);
    renderMeme(meme.selectedImgId);
}

function onUpdateFontSize(diff) {
    let meme = getMeme();
    if (meme.lines.length <= 0) return;
    updateFontSize(diff);
    renderMeme(meme.selectedImgId);
}

function onChangeValue(el) {
    let meme = getMeme();
    if (meme.lines.length <= 0) return;
    updateText(el.value);
    let line = getCurrLine();
    if (!line.text) setCurrTextInput();
    renderMeme(meme.selectedImgId);
}

function onCheckEmpty(el) {
    let currLine = getCurrLine();
    let meme = getMeme();
    if (!el.value) {
        currLine.text = EMPTY_TEXT;
        setCurrTextInput()
        renderMeme(meme.selectedImgId)
    }
}

function setCurrTextInput() {
    let meme = getMeme();
    const elMemeText = document.querySelector('input[name="meme-text"]');
    elMemeText.value = meme.lines[meme.selectedLineIdx].text
}

function renderMeme(imgId = null, isDownload = false) {

    var foundImg;
    if (!gIsUpload) foundImg = getSelectedImg(imgId);
    else {
        foundImg = {
            url: gUploadSrc
        }
    }

    var img = new Image();
    img.src = foundImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);

        let lines = getLines();

        lines.forEach((line, idx) => {
            setCanvasText(line.text, line.xPosition, line.yPosition, line.color, undefined, line.size);
            let measure = gCtx.measureText(line.text);
            setLineSize(idx, measure.width, measure.actualBoundingBoxAscent);
        })
        if (!isDownload) markLine();
    }
}

function markLine() {
    let currLine = getCurrLine()
    if (!currLine.text) return;
    gCtx.beginPath()
    gCtx.fillStyle = 'rgba(95, 44, 130, 0.2)';
    gCtx.lineWidth = 3
    gCtx.rect(currLine.xPosition - 10, currLine.yPosition - currLine.height - 5, currLine.width + 15, currLine.height + 15);
    gCtx.stroke()
    gCtx.fill()
}

function renderImgs(imgsToRender) {
    if (!imgsToRender) var imgsToRender = getImgs();

    const elImgsContainer = document.querySelector('.imgs-container');

    var strHTML = imgsToRender.map(img => {
        return `<img src="${img.url}" onclick="renderCanvas(${img.id})" alt="${img.name}" title="${img.name}" />`
    })

    elImgsContainer.innerHTML = strHTML.join('');
    gSearchByImgs = []
}

function renderPageCanvas() {
    const elImgsContainer = document.querySelector('.imgs-container');
    elImgsContainer.style.display = 'none';

    const elSearchBy = document.querySelector('.search-by');
    elSearchBy.style.display = 'none';

    const elUploadContainer = document.querySelector('.upload-img-container');
    elUploadContainer.style.display = 'none';

    const elMemeContainer = document.querySelector('.make-meme-container');
    elMemeContainer.style.display = 'flex';


    gCanvas = document.querySelector('#make-meme');
    gCtx = gCanvas.getContext('2d');


    if (window.outerWidth < MOBILE_SIZE) resizeCanvas(300, 300);
    else resizeCanvas(500, 500);
}

function changeByRes() {
    let lines = getLines();
    lines.forEach(line => {
        line.size = 30
        line.xPosition = 10
    })
}

function onInlineEdit() {
    const meme = getMeme();
    const currLine = getCurrLine();
    const inputWraper = document.querySelector('.inline-input');
    const input = document.querySelector('.inline-input input');
    gIsInlineEdit = true;

    inputWraper.style.left = `0px`;
    inputWraper.style.top = currLine.yPosition - currLine.height + `px`;
    inputWraper.style.height = currLine.height + 20 + `px`;
    input.style.fontSize = currLine.size + 'px';
    inputWraper.style.display = 'block';


    input.value = currLine.text;
    gCurrInputValue = input.value
    input.focus();
    currLine.text = '';
    renderMeme(meme.selectedImgId);
}

function onInlineChangeText(el, ev) {
    const currLine = getCurrLine();
    const memeInput = document.querySelector('input[name="meme-text"]');

    currLine.text = el.value;
    memeInput.value = el.value;
    gCurrInputValue = el.value
    if (ev.keyCode === 13) onInlineChangeFinish();
}

function onInlineChangeFinish() {
    const meme = getMeme();
    const currLine = getCurrLine();
    const inputWraper = document.querySelector('.inline-input');
    gIsInlineEdit = false;

    inputWraper.style.display = 'none';

    if (!gCurrInputValue) {
        gCurrInputValue = EMPTY_TEXT;
        currLine.text = EMPTY_TEXT;
        setCurrTextInput();
    }

    currLine.text = gCurrInputValue
    renderMeme(meme.selectedImgId);
}