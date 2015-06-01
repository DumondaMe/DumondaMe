'use strict';

var db = require('./../../../neo4j');
var exceptions = require('./../../../lib/error/exceptions');
var underscore = require('underscore');
var cdn = require('../../util/cdn');
var userInfo = require('../../user/userInfo');
var logger = requireLogger.getLogger(__filename);

var getMatchQuery = function (label, onlyContacts) {
    var matchQuery = "(page:" + label + " {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(otherUser:User)";
    if (onlyContacts) {
        matchQuery = matchQuery.concat("<-[IS_CONTACT]-(user:User {userId: {userId}})");
    } else {
        matchQuery = matchQuery.concat(", (user:User {userId: {userId}})");
    }
    return db.cypher().match(matchQuery).where("otherUser.userId <> {userId}");
};

var getReviews = function (label, onlyContacts, userId, pageId, skip, limit) {
    var matchQuery = getMatchQuery(label, onlyContacts);

    return matchQuery
        .with("page, rec, user, otherUser")
        .match("(otherUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(otherUser)")
        .with("page, rec, otherUser, rContact, vr, privacy")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("otherUser.userId AS userId, otherUser.name AS name, rec.rating AS rating, rec.comment AS comment, " +
        "privacy.profile AS profileVisible, privacy.image AS imageVisible")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            pageId: pageId, userId: userId, skip: skip, limit: limit
        }).getCommand();
};

var getReview = function (userId, requestParams) {

    var matchQuery = getMatchQuery(requestParams.label, requestParams.onlyContacts), commands = [];

    commands.push(getReviews(requestParams.label,
        requestParams.onlyContacts, userId, requestParams.pageId, requestParams.skip, requestParams.maxItems));

    return matchQuery
        .return("rec.rating AS rating, count(*) AS numberOfRatings")
        .orderBy("rating")
        .end({pageId: requestParams.pageId, userId: userId}).send(commands)
        .then(function (resp) {
            userInfo.addImageForThumbnail(resp[0]);
            return {ratings: resp[1], reviews: resp[0]};
        });
};

module.exports = {
    getReview: getReview
};
