'use strict';

let contactConnections = require('./dbDSL/contactConnection');
let recommendation = require('./dbDSL/recommendation');
let page = require('./dbDSL/page');
let blog = require('./dbDSL/blog');
let user = require('./dbDSL/user');
let feedback = require('./dbDSL/feedback');
let keyword = require('./dbDSL/keyword');
let dbConnectionHandling = require('./dbDSL/dbConnectionHandling');
let db = require('./db');

let init = function (numberOfUser, isElyoosAdmin) {
    let i = 0, userId;
    isElyoosAdmin = isElyoosAdmin || false;
    recommendation.init();
    dbConnectionHandling.init();
    return db.clearDatabase().then(function () {
        dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', 
        name: 'user Meier', surname: 'Meier', forename:'user', userId: '1', elyoosAdmin: {elyoosAdmin}})`).end({elyoosAdmin: isElyoosAdmin}).getCommand());
        for (i = 0; i < numberOfUser - 1; i++) {
            userId = i + 2;
            dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {name: 'user Meier${userId}', surname: 'Meier${userId}', forename:'user', 
            userId: '${userId}'})`).end().getCommand());
        }
    });
};

module.exports = {
    init: init,
    sendToDb: dbConnectionHandling.sendToDb,
    createContactConnection: contactConnections.createContactConnection,
    crateRecommendationsForPage: recommendation.crateRecommendationsForPage,
    crateRecommendationsForBlog: recommendation.crateRecommendationsForBlog,
    createBookPage: page.createBookPage,
    createYoutubePage: page.createYoutubePage,
    createGenericPage: page.createGenericPage,
    createLinkPage: page.createLinkPage,
    addAdminToPage: page.addAdminToPage,
    createBlog: blog.createBlog,
    createKeywords: keyword.createKeywords,
    setUserRegisteredDate: user.setUserRegisteredDate,
    setUserLastLoginTime: user.setUserLastLoginTime,
    setUserIsElyoosAdmin: user.setUserIsElyoosAdmin,
    createUser: user.createUser,
    blockUser: user.blockUser,
    setRecommendedUserOnHomeScreen: user.setRecommendedUserOnHomeScreen,
    createPrivacy: user.createPrivacy,
    createPrivacyNoContact: user.createPrivacyNoContact,
    createFeedbackBug: feedback.createFeedbackBug,
    createFeedbackIdea: feedback.createFeedbackIdea,
    createFeedbackDiscussion: feedback.createFeedbackDiscussion,
    createFeedbackDiscussionIdea: feedback.createFeedbackDiscussionIdea,
    createFeedbackComment: feedback.createFeedbackComment,
    createFeedbackRecommendation: feedback.createFeedbackRecommendation,
    closeFeedback: feedback.closeFeedback,
    reopenFeedback: feedback.reopenFeedback
};