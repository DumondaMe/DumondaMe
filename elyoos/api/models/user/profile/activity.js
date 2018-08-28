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
        .where(`feedElement.created <= {timestamp}`)
        .addCommand(activity.getFeedCommandString(guiLanguage, PAGE_SIZE))
        .end({userId, userDetailId, page, timestamp, topics, regions})
};

let getFeed = async function (userId, userDetailId, page, timestamp, languages, guiLanguage, topics, regions, req) {
    await security.checkAllowedToGetProfile(userId, userDetailId, req);

    let response = await getFeedCommand(userId, userDetailId, page, timestamp, languages, guiLanguage, topics,
        regions).send();
    return {
        feed: await answerResponseHandler.getFeed(response, userId), timestamp
    };
};


module.exports = {
    getFeedCommand,
    getFeed
};
