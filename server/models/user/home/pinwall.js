'use strict';

var db = require('./../../../neo4j');
var userInfo = require('./../userInfo');
var unread = require('../../messages/util/unreadMessages');
var pagePreview = require('./../../page/pagePreview');

var getContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .with("contacting, relContacting, user")
        .match("(contacting)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contacting)")
        .with("contacting, relContacting, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("contacting.userId AS userId, contacting.name AS name, relContacting.contactAdded AS contactAdded, " +
        "v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("contactAdded DESC")
        .limit("3")
        .end({userId: userId});
};

var getNumberOfContacting = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})<-[relContacting:IS_CONTACT]-(contacting:User)")
        .where("relContacting.contactAdded >= user.previousLastLogin")
        .return("count(*) AS numberOfContacting")
        .end({userId: userId});
};

var getPinwall = function (userId, request) {
    var commands = [];

    commands.push(unread.getUnreadMessages(userId).getCommand());
    commands.push(getContacting(userId).getCommand());
    commands.push(getNumberOfContacting(userId).getCommand());

    return db.cypher().match("(:User {userId: {userId}})-[:IS_CONTACT]->(:User)-[:RECOMMENDS]->(rec:Recommendation)-[:RECOMMENDS]->(page:Page)")
        .where("rec.created <= {timestamp}")
        .with("page, max(rec.created) AS created, avg(rec.rating) AS ratingAllContacts, count(rec) AS numberOfRatingsByContacts")
        .match("(user:User {userId: {userId}})-[:IS_CONTACT]->(contact:User)" +
        "-[:RECOMMENDS]->(rec:Recommendation)-[:RECOMMENDS]->(page)")
        .where("rec.created = created")
        .with("contact, rec, page, ratingAllContacts, numberOfRatingsByContacts, user")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, rec, page, ratingAllContacts, numberOfRatingsByContacts, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("contact.name AS name, contact.userId AS userId, rec.rating AS rating, rec.created AS created, rec.comment AS comment, " +
        "page.label AS label, page.title AS title, page.pageId AS pageId, page.description AS description, page.link AS link, " +
        "ratingAllContacts, numberOfRatingsByContacts, v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("rec.created DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({userId: userId, skip: request.skip, maxItems: request.maxItems, timestamp: request.timestamp})
        .send(commands)
        .then(function (resp) {
            userInfo.addImageForThumbnail(resp[0]);
            userInfo.addImageForThumbnail(resp[1]);
            userInfo.addImageForThumbnail(resp[3]);
            pagePreview.addPageUrl(resp[3]);
            return {pinwall: resp[3], messages: resp[0], contacting: {users: resp[1], numberOfContacting: resp[2][0].numberOfContacting}};
        });
};

module.exports = {
    getPinwall: getPinwall
};
