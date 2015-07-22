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
    return unread.getUnreadMessages(userId).send().then(function (unreadMessages) {
        var hasChanged;
        userInfo.addImageForThumbnail(unreadMessages);
        hasChanged = checkNewUnreadMessages(unreadMessages, session);
        return {hasChanged: hasChanged, messages: unreadMessages};
    });
};

var resetModificationForThread = function (threadId, isGroupThread, session) {
    session.userData.unreadMessages = underscore.filter(session.userData.unreadMessages, function (messageState) {
        return !(messageState.threadId === threadId && messageState.isGroupThread === isGroupThread);
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
