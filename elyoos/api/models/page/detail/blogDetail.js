'use strict';

let db = requireDb();
let recommendationCommand = require('./recommendation');
let cdn = require('elyoos-server-lib').cdn;
let profileUrl = require('./../../user/pinwall/pinwallElement/profileUrl');

let getDetailMessage = function (queryBlogResult, userRecommendation, allRecommendation, contactRecommendation) {
    let result = {page: {}};
    result.page.recommendedByUser = queryBlogResult.recommendedByUser;
    result.page.isAdmin = queryBlogResult.isAdmin;
    result.page.pageId = queryBlogResult.blog.pageId;
    result.page.created = queryBlogResult.blog.created;
    result.page.modified = queryBlogResult.blog.modified;
    result.page.title = queryBlogResult.blog.title;
    result.page.text = queryBlogResult.blog.text;
    result.page.topic = queryBlogResult.blog.topic;
    result.page.language = queryBlogResult.blog.language;
    result.page.visible = queryBlogResult.blog.visible;
    profileUrl.addProfileUrl(result.page, queryBlogResult);
    result.page.isPublic = true;
    if (queryBlogResult.blog.hasOwnProperty('visible') && queryBlogResult.blog.visible.length > 0) {
        result.page.isPublic = false;
    }
    if (queryBlogResult.blog.heightPreviewImage) {
        result.page.url = cdn.getUrl(`blog/${queryBlogResult.blog.pageId}/normal.jpg`);
    }
    result.recommendation = {
        summary: {
            all: allRecommendation,
            contact: contactRecommendation
        }
    };
    if (userRecommendation) {
        result.recommendation.user = userRecommendation;
    }
    return result;
};

let getDetail = function (pageId, label, userId) {

    let commands = [];
    commands.push(recommendationCommand.getUserRecommendation(pageId, userId));
    commands.push(recommendationCommand.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendationCommand.getRecommendationSummaryContacts(pageId, userId).getCommand());

    return db.cypher().match("(blog:Blog {pageId: {pageId}}), (user:User {userId: {userId}})")
        .optionalMatch("(contact:User)-[:WRITTEN]->(blog)")
        .where("contact.userId <> user.userId")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(contact)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("privacy is NULL")
        .return(`blog, user, contact, privacy, privacyNoContact, EXISTS((user)-[:WRITTEN]->(blog)) AS isAdmin, 
                 EXISTS((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(blog)) AS recommendedByUser`)
        .end({pageId: pageId, userId: userId}).send(commands).then(function (resp) {
            return getDetailMessage(resp[3][0], resp[0][0], resp[1][0], resp[2][0]);
        });
};

module.exports = {
    getDetail: getDetail
};
