'use strict';

let getSubject = function (templateData) {
    return `Invitation from ${templateData.name}`;
};

module.exports = {
    getSubject
};
