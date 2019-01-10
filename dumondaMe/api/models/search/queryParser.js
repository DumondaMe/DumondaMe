'use strict';

const wordsQuery = function (sentence, searchProperty) {
    let words = '';
    let wordsSplit = sentence.trim().split(" ");
    for (let word of wordsSplit) {
        word = word.trim();
        if (word.length === 2) {
            words = words + ` ${searchProperty}${word}~1`
        } else if (word.length === 3) {
            words = words + ` ${searchProperty}${word}~2`
        } else if (word.length > 3) {
            words = words + ` ${searchProperty}${word}~3`
        }
    }
    return words;
};


const cleanQuery = function (query) {
    let cleanedQuery = query.replace('-', '');
    return cleanedQuery.trim();
};

module.exports = {
    wordsQuery,
    cleanQuery
};
