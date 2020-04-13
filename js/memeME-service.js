'use strict';

var gImgs = [];
var gMeme;
var gSearchByImgs = []
var gImgNextId = 101;

function pinchOut() {
    var hammertime = new Hammer(gCanvas);
    hammertime.get('pinch').set({ enable: true });

    hammertime.on('pinchout', function (ev) {
        let currLine = getCurrLine();
        currLine.size += 0.2
        renderMeme(gMeme.selectedImgId)
    })
    hammertime.on('pinchin', function (ev) {
        let currLine = getCurrLine();
        currLine.size -= 0.2
        renderMeme(gMeme.selectedImgId)
    })
}

function doubleTapEdit() {
    var hammertime = new Hammer(gCanvas);
    hammertime.on('doubletap', function (ev) {
        onInlineEdit();
    });
}

function touchEvent() {
    var hammertime = new Hammer(gCanvas);
    hammertime.on('pan', function (ev) {
        // if (ev.pointerType === 'mouse') return;

        let offsetX = ev.srcEvent.offsetX
        let offsetY = ev.srcEvent.offsetY

        var currLine = gMeme.lines[gMeme.selectedLineIdx]

        currLine.xPosition = offsetX - (currLine.width / 2)
        currLine.yPosition = offsetY

        renderMeme(gMeme.selectedImgId)
    });
}

function dragAndDrop() {
    gElCanvas.addEventListener('mousedown', ev => {
        if (gIsText) gIsMovingText = true
    })

    gElCanvas.addEventListener('mousemove', ev => {
        if (!gIsMovingText) return;
        var currLine = gMeme.lines[gMeme.selectedLineIdx]

        currLine.xPosition = ev.offsetX - (currLine.width / 2)
        currLine.yPosition = ev.offsetY

        if (!gIsUpload) renderMeme(gMeme.selectedImgId)
        else renderMeme(undefined)
    })

    gElCanvas.addEventListener('mouseup', ev => {
        gIsMovingText = false;
    })
}

function changeFontColor(fontColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = fontColor;
}

function findClickedLine(x, y) {
    return gMeme.lines.find((line) => {
        return x > line.xPosition
            && x < line.xPosition + line.width
            && y > line.yPosition - line.height
            && y < line.yPosition
    });
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function setLineSize(lineIdx, width, height) {
    gMeme.lines[lineIdx].width = width
    gMeme.lines[lineIdx].height = height
}

function searchBy(value) {
    const imgs = getImgs();
    imgs.forEach((img, imgIdx) => {
        img.keywords.find(keyword => {
            if (keyword.toLowerCase() === value.toLowerCase()) gSearchByImgs.push(gImgs[imgIdx])
        })
    })
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx--
}

function textAlign(alignTo) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx]
    switch (alignTo) {
        case 'right':
            currLine.xPosition = gCanvas.width - currLine.width - 15
            break;
        case 'left':
            currLine.xPosition = 0 + 15
            break;
        case 'center':
            currLine.xPosition = (gCanvas.width / 2) - (currLine.width / 2)
            break;
    }
}

function addLine(xPosition, size = 40) {
    gMeme.lines.push({
        id: makeId(),
        text: 'New Line',
        xPosition,
        size,
        yPosition: gCanvas.height / 2,
    })
}

function switchLine() {
    if (gMeme.selectedLineIdx < gMeme.lines.length - 1) {
        gMeme.selectedLineIdx++
    } else {
        gMeme.selectedLineIdx = 0;
    }
    setCurrTextInput();
}

function moveLine(diff) {
    gMeme.lines[gMeme.selectedLineIdx].yPosition += parseInt(diff);
}

function updateFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += parseInt(diff);
}

function updateText(value) {
    gMeme.lines[gMeme.selectedLineIdx].text = value;
}


function resizeCanvas(width, height) {
    gCanvas.width = width;
    gCanvas.height = height;
}

function setCanvasText(text, x, y, fillStyle = 'white',
    strokeStyle = 'black', fontSize = '40', fontFamily = 'Impact') {
    gCtx.beginPath();
    gCtx.lineWidth = '2'
    gCtx.strokeStyle = strokeStyle
    gCtx.fillStyle = fillStyle
    gCtx.font = fontSize + 'px ' + fontFamily;
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    gCtx.closePath();
}

function createImgs() {
    gImgs.push(createImg('NO_NAME1', 'img/small-imgs/1.jpg', ['trump', 'men', 'angry']))
    gImgs.push(createImg('NO_NAME2', 'img/small-imgs/2.jpg', ['dog', 'cute']))
    gImgs.push(createImg('NO_NAME3', 'img/small-imgs/3.jpg', ['dog', 'cute']))
    gImgs.push(createImg('NO_NAME4', 'img/big-imgs/img4.jpg', ['trump', 'men', 'happy']))
    gImgs.push(createImg('NO_NAME5', 'img/small-imgs/4.jpg', ['cat', 'cute']))
    gImgs.push(createImg('NO_NAME6', 'img/small-imgs/5.jpg', ['baby']))
    gImgs.push(createImg('NO_NAME8', 'img/small-imgs/7.jpg', ['baby']))
    gImgs.push(createImg('NO_NAME8', 'img/small-imgs/nevo.jpg', ['nevo', 'cute']))
    gImgs.push(createImg('NO_NAME9', 'img/small-imgs/8.jpg', ['men', 'happy']))
    gImgs.push(createImg('NO_NAME10', 'img/big-imgs/img12.jpg', ['men', 'cute']))
    gImgs.push(createImg('NO_NAME11', 'img/small-imgs/9.jpg', ['baby', 'angry']))
    gImgs.push(createImg('NO_NAME12', 'img/small-imgs/10.jpg', ['obama', 'happy', 'men']))
    gImgs.push(createImg('NO_NAME14', 'img/small-imgs/12.jpg', ['men']))
    gImgs.push(createImg('NO_NAME15', 'img/big-imgs/Ancient-Aliens.jpg', ['men']))
    gImgs.push(createImg('NO_NAME16', 'img/small-imgs/13.jpg', ['men', 'happy']))
    gImgs.push(createImg('NO_NAME17', 'img/small-imgs/14.jpg', ['men']))
    gImgs.push(createImg('NO_NAME18', 'img/big-imgs/img6.jpg', ['dog']))
    gImgs.push(createImg('NO_NAME19', 'img/small-imgs/15.jpg', ['men']))
    gImgs.push(createImg('NO_NAME20', 'img/small-imgs/16.jpg', ['men', 'cute']))
    gImgs.push(createImg('NO_NAME21', 'img/small-imgs/17.jpg', ['men', 'putin']))
    gImgs.push(createImg('NO_NAME22', 'img/small-imgs/18.jpg', []))
}

function createImg(name, url, keywords) {
    return {
        id: gImgNextId++,
        name,
        url,
        keywords
    }
}

function setCurrMeme(imgId = undefined) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            id: makeId(),
            text: 'I dont like chocolate',
            xPosition: gCanvas.width * 0.165,
            yPosition: gCanvas.height * 0.20,
            size: 40,
            font: 'Impact',
            align: 'center',
            color: 'white',
            width: 0,
            height: 0
        }, {
            id: makeId(),
            text: 'I eat chocolate all day',
            xPosition: gCanvas.width * 0.14,
            yPosition: gCanvas.height * 0.85,
            size: 40,
            font: 'Impact',
            align: 'center',
            color: 'white',
            width: 0,
            height: 0
        }]
    }
}

function getMeme() {
    return gMeme
}

function getLines() {
    return gMeme.lines
}

function getImgs() {
    return gImgs;
}

function getSelectedImg(imgId) {
    return gImgs.find(img => {
        return imgId === img.id;
    })
}