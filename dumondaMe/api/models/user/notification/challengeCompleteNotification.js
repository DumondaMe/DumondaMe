'use strict';

const db = requireDb();


const addOneTimeNotificationChallengeComplete = function (userId, created) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeChallengeComplete'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeWatchingFirstQuestion'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeWatchingFirstCommitment'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeUpVoteFirstAnswer'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeFirstQuestion'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeFirstCommitment'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeFirstAnswer'})) AND ` +
            `EXISTS((u)<-[:NOTIFIED]->(:Notification {type: 'oneTimeFirstTrustCircleUser'}))`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeComplete', ` +
            `created: {created}, notificationId: randomUUID()})`)
        .return('u')
        .end({userId, created: created + 10})
};

module.exports = {
    addOneTimeNotificationChallengeComplete
};
