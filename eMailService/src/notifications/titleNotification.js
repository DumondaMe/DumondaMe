const i18next = require('i18next');

const getTitleOfNotification = async function (notifications, numberOfNotifications, language) {
    let title = 'Du hast Benachrichtigungen';
    for (let notification of notifications) {
        if(notification.notification) {
            if (notification.notification.type === 'newQuestion') {
                let questionCreator = notification.originators[0];
                title = i18next.t('notification:newQuestion.title',
                    {name: questionCreator.name, lng: language});
            } else if (notification.notification.type === 'addedToTrustCircle') {
                let user = notification.originators[0];
                title = i18next.t('notification:addedToTrustCircle.title',
                    {name: user.name, lng: language});
            }
        }
    }
    if (numberOfNotifications > 1) {
        title += ' ' + i18next.t('notification:common.andMore', {lng: language});
    }
    return title;
};


module.exports = {
    getTitleOfNotification
};
