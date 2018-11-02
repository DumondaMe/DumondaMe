'use strict';

const db = requireDb();
const security = require('./security');
const activity = require('./../feed/activity');
const answerResponseHandler = require('./../feed/response');

const PAGE_SIZE = 20;

let getFeedCommand = function (userId, userDetailId, page, timestamp, languages, guiLanguage, topics, regions) {
    page = page * PAGE_SIZE;
    return db.cypher()
        .match(`(activityElement:User {userId: {userDetailId}})-[relActivity:UP_VOTE|:WATCH|:IS_CREATOR]->(feedElement)`)
        .where(`feedElement.created <= {timestamp} AND (feedElement:Answer OR feedElement:AnswerCommitment OR 
                feedElement:Commitment OR feedElement:Question)`)
        .addCommand(activity.getFeedCommandString(guiLanguage, PAGE_SIZE))
        .end({userId, userDetailId, page, timestamp, topics, regions})
};

let getFeed = async function (userId, userDetailId, page, timestamp, languages, guiLanguage, topics, regions, req) {
    let showProfileActivity = await security.checkAllowedToGetProfile(userId, userDetailId, req);

    let feed = [];
    if(userDetailId === userId || showProfileActivity) {
        let response = await getFeedCommand(userId, userDetailId, page, timestamp, languages, guiLanguage, topics,
            regions).send();
        feed = await answerResponseHandler.getFeed(response, userId);
    }
    return {
        feed, timestamp
    };
};


module.exports = {
    getFeedCommand,
    getFeed
};
