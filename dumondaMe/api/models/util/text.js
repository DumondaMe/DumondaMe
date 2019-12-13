'use strict';

let getTruncatedText = function (originalText, maxLength) {
    let text = originalText;
    if (typeof originalText === 'string' && originalText.length > maxLength) {
        text = originalText.substring(0, maxLength) + '...';
    }
    return text;
};

module.exports = {
    getTruncatedText
};
