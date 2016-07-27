'use strict';

var db = require('./../../neo4j');
var statistic = require('./statistic');
var cdn = require('../util/cdn');
var profileUrl = require('./../user/pinwall/pinwallElement/profileUrl');

var getDetailMessage = function (queryBlogResult, numberOfRecommendationResult) {
    var result = {};
    result.numberOfRecommendations = numberOfRecommendationResult.numberOfRecommendations;
    result.recommendedByUser = queryBlogResult.recommendedByUser;
    result.isAdmin = queryBlogResult.isAdmin;
    result.created = queryBlogResult.blog.created;
    result.title = queryBlogResult.blog.title;
    result.text = queryBlogResult.blog.text;
    result.topic = queryBlogResult.blog.topic;
    profileUrl.addProfileUrl(result, queryBlogResult);
    result.isPublic = true;
    if(queryBlogResult.blog.hasOwnProperty('visible') && queryBlogResult.blog.visible.length > 0) {
        result.isPublic = false;
    }
    if (queryBlogResult.blog.heightPreviewImage) {
        result.url = cdn.getUrl(`blog/${queryBlogResult.blog.blogId}/normal.jpg`);
    }
    return result;
};

var getDetail = function (userId, blogId) {

    var commands = [];
    commands.push(statistic.getNumberOfRecommendationsCommand(blogId).getCommand());

    return db.cypher().match("(blog:Blog {blogId: {blogId}}), (user:User {userId: {userId}})")
        .optionalMatch("(contact:User)-[:WRITTEN]->(blog)")
        .where("contact.userId <> user.userId")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)-[relPrivacy:HAS_PRIVACY]->(privacy:Privacy)")
        .where("isContact.type = relPrivacy.type")
        .optionalMatch("(contact)-[:HAS_PRIVACY_NO_CONTACT]->(privacyNoContact:Privacy)")
        .where("privacy is NULL")
        .return(`blog, user, contact, privacy, privacyNoContact, EXISTS((user)-[:WRITTEN]->(blog)) AS isAdmin, 
                 EXISTS((user)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(blog)) AS recommendedByUser`)
        .end({blogId: blogId, userId: userId}).send(commands).then(function (resp) {
            return getDetailMessage(resp[1][0], resp[0][0]);
        });
};

module.exports = {
    getDetail: getDetail
};
