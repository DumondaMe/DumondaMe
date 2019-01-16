'use strict';

let getSubject = function (templateData) {
    if(templateData && templateData.numberOfNotifications === 1) {
        return `You have a new notification`;
    }
    return `You have new notifications`;
};

module.exports = {
    getSubject
};
