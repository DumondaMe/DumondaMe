'use strict';

const db = requireDb();

const setEMailNotificationLabel = function (enableEmailNotifications) {
    if (enableEmailNotifications) {
        return ' SET user:EMailNotificationEnabled';
    }
    return ' REMOVE user:EMailNotificationEnabled';
};

const setInviteToAnswerQuestion = function (enableInviteToAnswerQuestion) {
    if (enableInviteToAnswerQuestion) {
        return ' REMOVE user.disableInviteAnswerQuestionNotification';
    }
    return ' SET user.disableInviteAnswerQuestionNotification = true';
};

const changeSettings = async function (userId, enableEmailNotifications, enableInviteToAnswerQuestion) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .addCommand(setEMailNotificationLabel(enableEmailNotifications))
        .addCommand(setInviteToAnswerQuestion(enableInviteToAnswerQuestion))
        .end({userId: userId}).send();
};

module.exports = {
    changeSettings
};
