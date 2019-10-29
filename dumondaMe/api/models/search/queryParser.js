'use strict';

const getFuzzySearches = function (word, query) {
    if (word.length === 3) {
        query = `${query}~0.5`;
    } else if (word.length > 3) {
        query = `${query}~0.4`;
    }
    return query;
};

const getWildcard = function (query) {
    return `${query}*`
};

const getSearchProperty = function (word, searchProperty) {
    return `${searchProperty}${word}`;
};

const getWordQuery = function (word, searchProperty, counterWords, totalNumberOfWords) {
    let query = getSearchProperty(word, searchProperty);
    if (totalNumberOfWords === 1 && word.length < 3) {
        query = ` ${getWildcard(query)}`
    } else if (counterWords === totalNumberOfWords - 1) {
        query = ` (${getWildcard(query)} OR ${getFuzzySearches(word, query)})`
    } else {
        query = ` ${getFuzzySearches(word, query)} AND`
    }
    return query;
};

const getTotalNumberOfWords = function (words) {
    let numberOfWords = 0;
    for (let word of words) {
        if (word.trim().length > 1) {
            numberOfWords++;
        }
    }
    return numberOfWords;
};

const wordsQuery = function (sentence, searchProperty) {
    let words = '';
    let wordsSplit = sentence.trim().split(" ");
    let totalNumberOfWords = getTotalNumberOfWords(wordsSplit);
    let counterWords = 0;
    for (let word of wordsSplit) {
        word = word.trim();
        if (word.length > 1) {
            words = words + getWordQuery(word, searchProperty, counterWords, totalNumberOfWords);
            counterWords++;
        }
    }
    return words;
};


const cleanQuery = function (query) {
    let cleanedQuery = query.replace('*', '');
    return cleanedQuery.trim();
};

module.exports = {
    wordsQuery,
    cleanQuery
};
