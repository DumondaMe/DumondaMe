'use strict';

var contactConnections = require('./dbDSL/contactConnection');
var recommendation = require('./dbDSL/recommendation');
var page = require('./dbDSL/page');
var blog = require('./dbDSL/blog');
var user = require('./dbDSL/user');
var dbConnectionHandling = require('./dbDSL/dbConnectionHandling');
var db = require('./db');

var init = function (numberOfUser) {
    var i = 0, userId;
    recommendation.init();
    dbConnectionHandling.init();
    return db.clearDatabase().then(function () {
        dbConnectionHandling.getCommands().push(db.cypher().create(`(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', 
        name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})`).end().getCommand());
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
    createLinkPage: page.createLinkPage,
    createBlog: blog.createBlog,
    createUser: user.createUser,
    blockUser: user.blockUser,
    createPrivacy: user.createPrivacy,
    createPrivacyNoContact: user.createPrivacyNoContact
};