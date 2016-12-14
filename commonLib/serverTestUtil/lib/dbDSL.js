'use strict';

var contactConnections = require('./dbDSL/contactConnection');
var recommendation = require('./dbDSL/recommendation');
var page = require('./dbDSL/page');
var blog = require('./dbDSL/blog');
var user = require('./dbDSL/user');
var feedback = require('./dbDSL/feedback');
var keyword = require('./dbDSL/keyword');
var dbConnectionHandling = require('./dbDSL/dbConnectionHandling');
var db = require('./db');

var init = function (numberOfUser, isElyoosAdmin) {
    var i = 0, userId;
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
    createPlacePage: page.createPlacePage,
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
    createFeedbackRecommendation: feedback.createFeedbackRecommendation
};