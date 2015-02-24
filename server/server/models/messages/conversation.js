'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var userInfo = require('./../user/userInfo');
var moment = require('moment');
var logger = requireLogger.getLogger(__filename);

var addWriterInfo = function (userId, messages) {
    underscore.forEach(messages, function (message) {
        if (message.id === userId) {
            message.profileVisible = true;
            message.imageVisible = true;
        }
    });
};

var getThreadInfos = function (params) {
    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:Thread {threadId: {threadId}})<-[:ACTIVE]-(contact:User)")
        .return("contact.name AS description, HEAD(LABELS(thread)) AS threadType")
        .union()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:GroupThread {threadId: {threadId}})")
        .return("thread.description AS description, HEAD(LABELS(thread)) AS threadType")
        .end(params);
};

var getMessagesOfThreads = function (params, setTime) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread {threadId: {threadId}})" +
        "-[:NEXT_MESSAGE*]->(message:Message)-[:WRITTEN]->(writer:User)")
        .where("thread:Thread OR thread:GroupThread")
        .set('active', setTime)
        .with("user, message, writer")
        .optionalMatch("(writer)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .where('writer.userId <> user.userId')
        .with("user, message, writer, vr, v")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(writer)")
        .where('writer.userId <> user.userId')
        .with("user, message, writer, vr, v, rContact")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY') OR " +
        "writer.userId = user.userId")
        .return("message.text AS text, message.messageAdded AS timestamp, writer.userId AS id, " +
        "v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("message.messageAdded DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end(params);
};

var getMessages = function (userId, threadId, itemsPerPage, skip, expires) {

    var commands = [], now = Math.floor(moment.utc().valueOf() / 1000);

    commands.push(getThreadInfos({
        userId: userId,
        threadId: threadId
    }).getCommand());

    return getMessagesOfThreads({
        userId: userId,
        threadId: threadId,
        skip: skip,
        limit: itemsPerPage,
        lastTimeVisited: now
    }, {lastTimeVisited: now})
        .send(commands)
        .then(function (resp) {
            if (resp[0][0] && resp[0][0].description && resp[0][0].threadType) {
                addWriterInfo(userId, resp[1]);
                userInfo.addImageForPreview(resp[1], expires);
                return {
                    messages: resp[1],
                    threadDescription: resp[0][0].description,
                    isGroupThread: resp[0][0].threadType === 'GroupThread'
                };
            }
            var invalidOperationException = new exceptions.invalidOperation('User ' + userId + ' tried to access not participating thread ' + threadId);
            logger.warn(invalidOperationException.message, {error: ''});
            return Promise.reject(invalidOperationException);
        });
};


module.exports = {
    getMessages: getMessages
};
