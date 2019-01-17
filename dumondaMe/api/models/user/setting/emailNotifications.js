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

const setNewNotifications = function (enableInviteToAnswerQuestion) {
    if (enableInviteToAnswerQuestion) {
        return ' REMOVE user.disableNewNotificationEmail';
    }
    return ' SET user.disableNewNotificationEmail = true';
};

const changeSettings = async function (userId, enableEmailNotifications, enableInviteToAnswerQuestion,
                                       enableNewNotifications) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .addCommand(setEMailNotificationLabel(enableEmailNotifications))
        .addCommand(setInviteToAnswerQuestion(enableInviteToAnswerQuestion))
        .addCommand(setNewNotifications(enableNewNotifications))
        .end({userId: userId}).send();
};

module.exports = {
    changeSettings
};
