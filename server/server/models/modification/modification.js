'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var message = require('../messages/messageThread');
var logger = requireLogger.getLogger(__filename);

var hasModification = function (userId, session) {
    return message.getNumberOfUnreadMessages(userId).then(function (numberOf) {
        if (session.userData.numberOfUnreadMessages !== numberOf) {
            session.userData.numberOfUnreadMessages = numberOf;
            return true;
        }
        return false;
    });
};

var initModificationOnSession = function (userId, session) {
    session.userData = {};
    return message.getNumberOfUnreadMessages(userId).then(function (numberOf) {
        session.userData.numberOfUnreadMessages = numberOf;
    });
};

module.exports = {
    hasModification: hasModification,
    initModificationOnSession: initModificationOnSession
};
