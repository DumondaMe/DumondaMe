'use strict';

const db = requireDb();

const setEMailNotificationLabel = function (enableEmailNotifications) {
    if (enableEmailNotifications) {
        return ' SET user:EMailNotificationEnabled';
    }
    return ' REMOVE user:EMailNotificationEnabled';
};

const setInterval = function (interval) {
    if (interval !== 'never') {
        return ' SET user.emailNotificationInterval = {interval}';
    }
    return ' REMOVE user.emailNotificationInterval';
};

const getIntervalValue = function (interval) {
    switch (interval) {
        case "hour":
            return 3600;
        case "day":
            return 86400;
        case "3days":
            return 259200;
        case "week":
            return 604800;
        default:
            return Number.MAX_SAFE_INTEGER
    }
};

const changeSettings = async function (userId, interval) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .addCommand(setEMailNotificationLabel(interval !== 'never'))
        .addCommand(setInterval(interval))
        .end({userId: userId, interval: getIntervalValue(interval)}).send();
};

module.exports = {
    changeSettings
};
