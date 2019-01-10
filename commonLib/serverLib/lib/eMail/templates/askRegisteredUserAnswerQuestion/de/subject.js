'use strict';

let getSubject = function (templateData) {
    return `${templateData.question}`;
};

module.exports = {
    getSubject
};
