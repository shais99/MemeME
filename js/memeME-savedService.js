'use strict';

function deleteMeme(idx) {
    gSavedMemes.splice(idx, 1);
    saveToStorage(KEY, gSavedMemes)
}