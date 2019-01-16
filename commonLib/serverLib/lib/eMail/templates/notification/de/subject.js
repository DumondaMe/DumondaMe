'use strict';

let getSubject = function (templateData) {
    if(templateData && templateData.numberOfNotifications === 1) {
        return `Du hast eine neue Benachrichtigung`;
    }
    return `Du hast neue Benachrichtigungen`;
};

module.exports = {
    getSubject
};
