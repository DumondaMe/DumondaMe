'use strict';

let contactConnections = require('./dbDSL/contactConnection');
let recommendation = require('./dbDSL/recommendation');
let page = require('./dbDSL/page');
let blog = require('./dbDSL/blog');
let user = require('./dbDSL/user');
let feedback = require('./dbDSL/feedback');
let messages = require('./dbDSL/messages');
let news = require('./dbDSL/news');
let events = require('./dbDSL/events');
let tc = require('./dbDSL/transitionConnect');
let question = require('./dbDSL/question');
let unsubscribe = require('./dbDSL/unsubscribe');
let dbConnectionHandling = require('./dbDSL/dbConnectionHandling');
let db = require('./db');

let init = function (numberOfUser, isElyoosAdmin) {
    let i = 0, userId;
    isElyoosAdmin = isElyoosAdmin || false;
    recommendation.init();
    dbConnectionHandling.init();
    return db.clearDatabase().then(function () {
        dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', 
        name: 'user Meier', surname: 'Meier', forename:'user', userId: '1', lastSetupAccount: 500, elyoosAdmin: {elyoosAdmin},
        userLocationDescription: 'irgendwo', latitude: 1.1, longitude: 2.2})`)
            .end({elyoosAdmin: isElyoosAdmin}).getCommand());
        for (i = 0; i < numberOfUser - 1; i++) {
            userId = i + 2;
            dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {name: 'user Meier${userId}', surname: 'Meier${userId}', forename:'user', 
            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', userId: '${userId}', lastSetupAccount: 500, email: 'user${userId}@irgendwo.ch', 
            emailNormalized: 'user${userId}@irgendwo.ch', latitude: 0, longitude: 0})`).end().getCommand());
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
    setUserRegisteredDate: user.setUserRegisteredDate,
    setUserLastLoginTime: user.setUserLastLoginTime,
    setUserIsElyoosAdmin: user.setUserIsElyoosAdmin,
    setUserLocation: user.setUserLocation,
    setUserEmail: user.setUserEmail,
    createUser: user.createUser,
    createUserRegisterRequest: user.createUserRegisterRequest,
    blockUser: user.blockUser,
    invitationSentBeforeRegistration: user.invitationSentBeforeRegistration,
    inviteUser: user.inviteUser,
    setRecommendedUserOnHomeScreen: user.setRecommendedUserOnHomeScreen,
    createPrivacy: user.createPrivacy,
    createPrivacyNoContact: user.createPrivacyNoContact,
    createNews: news.createNews,
    createFeedbackBug: feedback.createFeedbackBug,
    createFeedbackIdea: feedback.createFeedbackIdea,
    createFeedbackDiscussion: feedback.createFeedbackDiscussion,
    createFeedbackDiscussionIdea: feedback.createFeedbackDiscussionIdea,
    createFeedbackComment: feedback.createFeedbackComment,
    createFeedbackRecommendation: feedback.createFeedbackRecommendation,
    closeFeedback: feedback.closeFeedback,
    reopenFeedback: feedback.reopenFeedback,
    createPageEventNewAddress: events.createPageEventNewAddress,
    createPageEventExistingAddress: events.createPageEventExistingAddress,
    createThread: messages.createThread,
    createMessages: messages.createMessages,
    createQuestion: question.createQuestion,
    createAnswer: question.createAnswer,
    upVoteAnswer: question.upVoteAnswer,
    unsubscribeInvitation: unsubscribe.unsubscribeInvitation,
    exportOrganisationToTransitionConnect: tc.exportOrganisation,
    exportEventToTransitionConnect: tc.exportEvent,
    stopExportOrganisationToTransitionConnect: tc.stopExportOrganisation
};