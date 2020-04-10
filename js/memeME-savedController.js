'use strict';

const KEY = 'memes';
var gSavedMemes = loadFromStorage(KEY);

function onInitSaved() {
    renderSavedMemes()
}

function renderSavedMemes() {

    if (!gSavedMemes) {
        document.querySelector('.saved-memes-title').innerText = 'No Saved Memes!';
        return
    } else if (!gSavedMemes.length) {
        document.querySelector('.saved-memes-title').innerText = 'No Saved Memes!';
    }
    var strHTML = gSavedMemes.map((meme, idx) => {
        return `<div class="single-meme">
            <img src="${meme.imgContent}" onclick="onOpenSaved('${meme.imgContent}')" alt="" />
            <a class="delete-meme saved-icon fas fa-trash-alt" onclick="onDeleteMeme(${idx})"></a>
            <a href="#" class="download-meme saved-icon fas fa-download" onmouseup="onDownloadMeme(this, '${meme.imgContent}')" download="my-meme.jpg"></a>
        </div>`
    })

    const elImgsContainer = document.querySelector('.imgs-container');
    elImgsContainer.innerHTML = strHTML.join('');

}

function onDownloadMeme(elLink, dataURL) {
    elLink.href = dataURL
}

function onDeleteMeme(idx) {
    deleteMeme(idx);
    renderSavedMemes()
}

function onOpenSaved(dataURL) {
    var win = window.open();
    win.document.write('<iframe src="' + dataURL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}