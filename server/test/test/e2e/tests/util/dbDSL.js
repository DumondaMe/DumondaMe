'use strict';

var contactConnections = require('./dbDSL/contactConnection');
var recommendation = require('./dbDSL/recommendation');
var page = require('./dbDSL/page');
var blog = require('./dbDSL/blog');
var dbConnectionHandling = require('./dbDSL/dbConnectionHandling');

var init = function () {
    recommendation.init();
    dbConnectionHandling.init();
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
    createBlog: blog.createBlog
};