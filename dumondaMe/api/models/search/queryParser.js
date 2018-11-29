'use strict';

const wordsQuery = function (sentence, searchProperty) {
    let words = '';
    let wordsSplit = sentence.trim().split(" ");
    for (let word of wordsSplit) {
        words = words + ` ${searchProperty}${word}~3`
    }
    return words;
};

module.exports = {
    wordsQuery
};
