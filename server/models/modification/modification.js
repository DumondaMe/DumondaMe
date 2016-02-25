'use strict';

var underscore = require('underscore');
var userInfo = require('./../user/userInfo');
var unread = require('../messages/util/unreadMessages');

var checkNewUnreadMessages = function (unreadMessages, session) {

    var hasChanged = false, sessionUnreadMessage;
    if (unreadMessages.length !== session.userData.unreadMessages.length) {
        session.userData.unreadMessages = unreadMessages;
        hasChanged = true;
    } else {
        underscore.forEach(unreadMessages, function (unreadMessage) {
            sessionUnreadMessage = underscore.findWhere(session.userData.unreadMessages,
                {threadId: unreadMessage.threadId, numberOfUnreadMessages: unreadMessage.numberOfUnreadMessages});
            if (!sessionUnreadMessage) {
                session.userData.unreadMessages = unreadMessages;
                hasChanged = true;
            }
        });
    }
    return hasChanged;
};

var hasModification = function (userId, session) {
    var commands = [];
    commands.push(unread.getTotalNumberOfUnreadMessages(userId).getCommand());
    return unread.getUnreadMessages(userId).send(commands).then(function (resp) {
        var hasChanged, unreadMessages = resp[1];
        userInfo.addImageForThumbnail(unreadMessages);
        hasChanged = checkNewUnreadMessages(unreadMessages, session);
        return {hasChanged: hasChanged, messages: unreadMessages, totalUnreadMessages: resp[0][0].totalUnreadMessages};
    });
};

var resetModificationForThread = function (threadId, session) {
    session.userData.unreadMessages = underscore.filter(session.userData.unreadMessages, function (messageState) {
        return messageState.threadId !== threadId;
    });
};

var initModificationOnSession = function (userId, session, callback) {
    session.userData = {unreadMessages: []};
    unread.getUnreadMessages(userId).send().then(function (unreadMessages) {
        session.userData.unreadMessages = unreadMessages;
        callback();
    });
};

module.exports = {
    hasModification: hasModification,
    initModificationOnSession: initModificationOnSession,
    resetModificationForThread: resetModificationForThread
};
