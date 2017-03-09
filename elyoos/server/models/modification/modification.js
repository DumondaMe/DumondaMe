'use strict';

let underscore = require('underscore');
let userInfo = require('./../user/userInfo');
let unread = require('../messages/util/unreadMessages');
let _ = require('lodash');

let checkNewUnreadMessages = function (unreadMessages, session) {

    let hasChanged = false, sessionUnreadMessage;
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

let hasModification = function (userId, session) {
    let commands = [];
    commands.push(unread.getTotalNumberOfUnreadMessages(userId).getCommand());
    return unread.getUnreadMessages(userId).send(commands).then(function (resp) {
        let hasChanged, unreadMessages = resp[1];
        userInfo.addImageForThumbnail(unreadMessages);
        hasChanged = checkNewUnreadMessages(unreadMessages, session);
        return {hasChanged: hasChanged, messages: unreadMessages, totalUnreadMessages: resp[0][0].totalUnreadMessages};
    });
};

let resetModificationForThread = function (threadId, session) {
    session.userData.unreadMessages = underscore.filter(session.userData.unreadMessages, function (messageState) {
        return messageState.threadId !== threadId;
    });
};

let initModificationOnSession = function (userId, session, callback) {
    session.userData = {unreadMessages: []};
    return unread.getUnreadMessages(userId).send().then(function (unreadMessages) {
        session.userData.unreadMessages = unreadMessages;
        if (_.isFunction(callback)) {
            callback();
        }
    });
};

module.exports = {
    hasModification: hasModification,
    initModificationOnSession: initModificationOnSession,
    resetModificationForThread: resetModificationForThread
};
