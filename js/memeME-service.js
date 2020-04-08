'use strict';

var gImgs = [];
var gMeme;
var gSearchByImgs = []

function searchBy(value) {
    const imgs = getImgs();
    imgs.forEach((img, imgIdx) => {
        img.keywords.find(keyword => {
            if (keyword === value) gSearchByImgs.push(gImgs[imgIdx])
        })
    })
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx--
}

function textAlign(alignTo) {
    switch (alignTo) {
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].align = alignTo
            gMeme.lines[gMeme.selectedLineIdx].xPosition = gCanvas.width
            break;
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].align = alignTo
            gMeme.lines[gMeme.selectedLineIdx].xPosition = 0
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].align = alignTo
            gMeme.lines[gMeme.selectedLineIdx].xPosition = gCanvas.width / 2
            break;
    }
}

function addLine() {
    gMeme.lines.push({
        text: 'New Line',
        xPosition: gCanvas.width / 2,
        yPosition: gCanvas.height / 2,
        size: 40,
        font: 'Impact',
        align: 'center',
        color: 'white'
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


function resizeCanvas() {
    gCanvas.width = 500;
    gCanvas.height = 500;
}

function setMeme(imgId) {
    const foundImg = gImgs.find(img => {
        return imgId === img.id;
    })
    var img = new Image();
    img.src = foundImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);

        for (var i = 0; i < gMeme.lines.length; i++) {
            var currMeme = gMeme.lines[i];
            setCanvasText(currMeme.text, currMeme.xPosition, currMeme.yPosition, undefined, undefined, currMeme.size, currMeme.align);
        }
    }
}

function setCanvasText(text, x, y, fillStyle = 'white',
    strokeStyle = 'black', fontSize = '40',
    textAlign = 'center', fontFamily = 'Impact') {
    gCtx.beginPath();
    gCtx.lineWidth = '2'
    gCtx.strokeStyle = strokeStyle
    gCtx.fillStyle = fillStyle
    gCtx.font = fontSize + 'px ' + fontFamily;
    gCtx.textAlign = textAlign;
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
        id: makeId(),
        name,
        url,
        keywords
    }
}

function setCurrMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            text: 'I dont like chocolate',
            xPosition: 250,
            yPosition: 50,
            size: 40,
            font: 'Impact',
            align: 'center',
            color: 'white'
        }, {
            text: 'I eat chocolate all day',
            xPosition: 250,
            yPosition: 450,
            size: 40,
            font: 'Impact',
            align: 'center',
            color: 'white'
        }]
    }
}

function getImgs() {
    return gImgs;
}