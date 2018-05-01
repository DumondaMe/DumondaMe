'use strict';

let contactConnections = require('./dbDSL/contactConnection');
let page = require('./dbDSL/page');
let commitment = require('./dbDSL/commitment');
let answer = require('./dbDSL/answer');
let user = require('./dbDSL/user');
let news = require('./dbDSL/news');
let events = require('./dbDSL/events');
let notification = require('./dbDSL/notification');
let tc = require('./dbDSL/transitionConnect');
let question = require('./dbDSL/question');
let region = require('./dbDSL/region');
let topic = require('./dbDSL/topic');
let unsubscribe = require('./dbDSL/unsubscribe');
let dbConnectionHandling = require('./dbDSL/dbConnectionHandling');
let db = require('./db');

let init = function (numberOfUser, isElyoosAdmin) {
    let i = 0, userId;
    isElyoosAdmin = isElyoosAdmin || false;
    dbConnectionHandling.init();
    return db.clearDatabase().then(function () {
        dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', 
        name: 'user Meier', surname: 'Meier', forename:'user', userDescription: 'superman', userId: '1', lastSetupAccount: 500, elyoosAdmin: {elyoosAdmin}, language: 'de',
        userLocationDescription: 'irgendwo', latitude: 1.1, longitude: 2.2, privacyMode: 'public'})`)
            .end({elyoosAdmin: isElyoosAdmin}).getCommand());
        for (i = 0; i < numberOfUser - 1; i++) {
            userId = i + 2;
            dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {name: 'user Meier${userId}', surname: 'Meier${userId}', forename:'user', userDescription: 'superman${userId}', 
            password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', userId: '${userId}', lastSetupAccount: 500, email: 'user${userId}@irgendwo.ch', 
            language: 'de', emailNormalized: 'user${userId}@irgendwo.ch', latitude: 0, longitude: 0, privacyMode: 'public'})`).end().getCommand());
        }
    });
};

let setApocIndex = async function () {
    await db.cypher().call(`apoc.index.addAllNodes('keywords',{Topic: ["name"]}, {autoUpdate:true, type:"fulltext"})`)
        .send();
    await db.cypher().call(`apoc.index.addAllNodes('entities',{
                            User: ["name"],
                            Question:  ["question"],
                            Commitment: ["title"]}, {autoUpdate:true, type:"fulltext"})`).send();
};

module.exports = {
    init: init,
    setApocIndex: setApocIndex,
    sendToDb: dbConnectionHandling.sendToDb,
    createContactConnection: contactConnections.createContactConnection,

    createGenericPage: page.createGenericPage,
    addAdminToPage: page.addAdminToPage,

    createCommitment: commitment.createCommitment,
    showQuestionOnCommitment: commitment.showQuestionOnCommitment,
    watchCommitment: commitment.watchCommitment,

    createBookAnswer: answer.createBookAnswer,
    createYoutubeAnswer: answer.createYoutubeAnswer,
    createVimeoAnswer: answer.createVimeoAnswer,
    createLinkAnswer: answer.createLinkAnswer,
    createTextAnswer: answer.createTextAnswer,
    createCommitmentAnswer: answer.createCommitmentAnswer,
    createNote: answer.createNote,
    upVoteNote: answer.upVoteNote,
    upVoteAnswer: answer.upVoteAnswer,
    setOriginalAnswer: answer.setOriginalAnswer,

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
    setUserPrivacy: user.setUserPrivacy,
    createPrivacy: user.createPrivacy,

    createNews: news.createNews,

    createPageEventNewAddress: events.createPageEventNewAddress,
    createPageEventExistingAddress: events.createPageEventExistingAddress,

    createQuestion: question.createQuestion,
    watchQuestion: question.watchQuestion,

    unsubscribeInvitation: unsubscribe.unsubscribeInvitation,

    exportOrganisationToTransitionConnect: tc.exportOrganisation,
    exportEventToTransitionConnect: tc.exportEvent,
    stopExportOrganisationToTransitionConnect: tc.stopExportOrganisation,

    createTopic: topic.createTopic,

    createRegion: region.createRegion,

    notificationShowQuestionOnCommitmentRequest: notification.showQuestionOnCommitmentRequest,
    notificationUserAddedToTrustCircle: notification.userAddedToTrustCircle
};