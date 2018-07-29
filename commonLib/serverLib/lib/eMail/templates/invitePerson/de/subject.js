'use strict';

let getSubject = function (templateData) {
    return `Einladung von ${templateData.name}`;
};

module.exports = {
    getSubject
};
