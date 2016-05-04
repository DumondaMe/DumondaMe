"use strict";

var db = require('./../../neo4j');
var uuid = require('./../../lib/uuid');
var time = require('./../../lib/time');
var eMailQueue = require('./../../lib/eMail/eMailQueue');

var received = function (userId) {
    var jobId = uuid.generateUUID(), updateTime = time.getNowUtcTimestamp();

    return db.cypher().match("(email:EMailNotification {userId: {userId}})")
        .return("email").end({userId: userId}).send()
        .then(function (resp) {
            if (resp.length === 0) {
                return db.cypher().create("(:EMailNotification {userId: {userId}, lastJobId: {jobId}, lastUpdated: {updateTime}, countUpdates: 0})")
                    .end({userId: userId, jobId: jobId, updateTime: updateTime}).send();
            } else {
                return db.cypher().match("(e:EMailNotification {userId: {userId}})")
                    .set("e", {lastJobId: jobId, lastUpdated: updateTime, countUpdates: resp[0].email.countUpdates + 1}).end({userId: userId}).send();
            }
        }).then(function () {
            eMailQueue.createJob('messageReceived', {userId: userId, jobId: jobId});
        });
};

module.exports = {
    received: received
};
