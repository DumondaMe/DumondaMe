'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var unread = require('../messages/util/unreadMessages');
var logger = requireLogger.getLogger(__filename);

var hasModification = function (userId, session) {
    return unread.hasUnreadMessages(userId).then(function (unreadMessages) {
        var hasChanged = false, sessionUnreadMessage;
        if (unreadMessages.length !== session.userData.unreadMessages.length) {
            session.userData.unreadMessages = unreadMessages;
            hasChanged = true;
        } else {
            underscore.forEach(unreadMessages, function (unreadMessage) {
                sessionUnreadMessage = underscore.findWhere(session.userData.unreadMessages, unreadMessage);
                if (!sessionUnreadMessage) {
                    session.userData.unreadMessages = unreadMessages;
                    hasChanged = true;
                }
            });
        }
        return hasChanged;
    });
};

var resetModificationForThread = function (threadId, isGroupThread, session) {
    session.userData.unreadMessages = underscore.filter(session.userData.unreadMessages, function (messageState) {
        return messageState.threadId !== threadId && messageState.isGroupThread !== isGroupThread;
    });
};

var initModificationOnSession = function (userId, session, callback) {
    session.userData = {unreadMessages: []};
    unread.hasUnreadMessages(userId).then(function (unreadMessages) {
        session.userData.unreadMessages = unreadMessages;
        callback();
    });
};

module.exports = {
    hasModification: hasModification,
    initModificationOnSession: initModificationOnSession,
    resetModificationForThread: resetModificationForThread
};
