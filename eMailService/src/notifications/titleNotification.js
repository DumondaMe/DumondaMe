const i18next = require('i18next');

const getTitleOfNotification = async function (notifications, language) {
    let title = 'Du hast Benachrichtigungen';
    for (let notification of notifications) {
        if (notification.notification && notification.notification.type === 'newQuestion') {
            let questionCreator = notification.originators[0];
            title = i18next.t('notification:newQuestion.title',
                {name: questionCreator.name, lng: language});
        }
    }
    return title;
};


module.exports = {
    getTitleOfNotification
};
