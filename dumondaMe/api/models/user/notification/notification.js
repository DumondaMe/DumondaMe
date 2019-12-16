'use strict';

const moreSearchResult = require('../../util/moreSearchResults');
const readNotification = require('./read');
const response = require('./response');
const db = requireDb();
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getNumberOfUnreadNotificationsCommand = function (userId) {
    return db.cypher().match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification:Unread)`)
        .return(`COUNT(DISTINCT n) AS numberOfUnreadNotifications`)
        .end({userId});
};

const getNumberOfUnreadNotifications = async function (userId) {
    let result = await getNumberOfUnreadNotificationsCommand(userId).send();
    return {numberOfUnreadNotifications: result[0].numberOfUnreadNotifications};
};

const getChallengeStatusCommand = function (userId) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .return(`EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeWatchingFirstQuestion'})) ` +
            `AS watchQuestion, ` +
            `EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeWatchingFirstCommitment'})) ` +
            `AS watchCommitment, ` +
            `EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeUpVoteFirstAnswer'})) ` +
            `AS likeAnswer, ` +
            `EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeFirstTrustCircleUser'})) ` +
            `AS addedPersonToTrustCircle, ` +
            `EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeFirstQuestion'})) ` +
            `AS createdQuestion, ` +
            `EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeFirstCommitment'})) ` +
            `AS createdCommitment, ` +
            `EXISTS((u)<-[:NOTIFIED]-(:Notification:OneTime {type: 'oneTimeFirstAnswer'})) ` +
            `AS createdAnswer, true AS createAccount`)
        .end({userId});
};

const getNotifications = async function (userId, skip, limit) {
    let result = await db.cypher()
        .match(`(u:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)`)
        .with(`u, n`)
        .orderBy(`n.created DESC`)
        .skip(`{skip}`).limit(`{limit}`)
        .optionalMatch(`(n)-[:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
        .with(`u, n, count(originator) AS numberOfOriginators`)
        .optionalMatch(`(n)-[relInfo:NOTIFICATION]->(info)`)
        .optionalMatch(`(n)-[relOriginator:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
        .with(`n, info, relInfo, originator, relOriginator, numberOfOriginators`)
        .orderBy(`relOriginator.created DESC, relInfo.created DESC`)
        .return(`DISTINCT n AS notification, collect(DISTINCT {info: info, type: labels(info)}) AS infos, 
                 collect(DISTINCT relInfo) AS relInfos, none(label in labels(n) WHERE label = 'Unread') AS read,
                 collect(DISTINCT {originator: originator, relOriginator: relOriginator,
                 isContact: EXISTS((:User {userId: {userId}})<-[:IS_CONTACT]-(originator)),
                 isHarvestingUser: ANY (label IN LABELS(originator) WHERE label = 'HarvestingUser')})[0..3] AS originators,
                 ANY (label IN LABELS(n) WHERE label = 'OneTime') AS isOneTime, numberOfOriginators`)
        .orderBy(`n.created DESC`)
        .end({userId, skip, limit: limit + 1})
        .send([getNumberOfUnreadNotificationsCommand(userId).getCommand(),
            getChallengeStatusCommand(userId).getCommand()]);
    logger.info(`User ${userId} requested notifications`);
    let hasMoreNotifications = moreSearchResult.getHasMoreResults(result[1], limit);

    if (skip === 0) {
        await readNotification.markAsRead(userId);
    }

    return {
        notifications: await response.getResponse(result[2]), hasMoreNotifications,
        numberOfUnreadNotifications: result[0][0].numberOfUnreadNotifications,
        challengeStatus: result[1][0]
    };
};

module.exports = {
    getNotifications,
    getNumberOfUnreadNotifications,
    getChallengeStatusCommand
};
