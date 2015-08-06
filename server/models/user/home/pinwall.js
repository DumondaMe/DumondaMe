'use strict';

var db = require('./../../../neo4j');
var userInfo = require('./../userInfo');
var unread = require('../../messages/util/unreadMessages');
var pagePreview = require('./../../page/pagePreview');
var cdn = require('../../util/cdn');
var _ = require('underscore');

function compare(a, b) {
    return b.created - a.created;
}

var addBlogUrl = function (blogs) {
    _.each(blogs, function (blog) {
        if (blog.hasOwnProperty('heightPreviewImage')) {
            blog.url = cdn.getUrl('blog/' + blog.blogId + '/preview.jpg');
            blog.urlFull = cdn.getUrl('blog/' + blog.blogId + '/normal.jpg');
        }
    });
};

var getBlog = function (userId, limit, skip) {
    return db.cypher().match("(user:User {userId: {userId}})-[:IS_CONTACT]->(contact:User)-[written:WRITTEN]->(blog:Blog)")
        .optionalMatch("(user)<-[isContact:IS_CONTACT]-(contact)")
        .with("user, contact, blog, written, isContact, '.*' + isContact.type + '.*' AS type")
        .where("written.visible =~ type OR written.visible IS NULL")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("user, contact, blog, written, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("contact.userId AS userId, contact.name AS name, blog.blogId AS blogId, blog.title AS title, blog.created AS created," +
        "blog.text AS text, blog.heightPreviewImage AS heightPreviewImage, false AS isAdmin, " +
        "v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .unionAll()
        .match("(user:User {userId: {userId}})-[written:WRITTEN]->(blog:Blog)")
        .return("user.userId AS userId, user.name AS name, blog.blogId AS blogId, blog.title AS title, blog.created AS created," +
        "blog.text AS text, blog.heightPreviewImage AS heightPreviewImage, true AS isAdmin, " +
        "true AS profileVisible, true AS imageVisible")
        .orderBy("created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({userId: userId, limit: limit, skip: skip});
};

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

var getUserInfos = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})-[type:HAS_PRIVACY]->(:Privacy)")
        .return("type.type AS type")
        .orderBy("type")
        .end({userId: userId});
};

var getPinwall = function (userId, request) {
    var commands = [];

    commands.push(unread.getUnreadMessages(userId).getCommand());
    commands.push(getContacting(userId).getCommand());
    commands.push(getNumberOfContacting(userId).getCommand());
    commands.push(getBlog(userId, request.maxItems, request.skip).getCommand());
    commands.push(getUserInfos(userId).getCommand());

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
            userInfo.addImageForThumbnail(resp[5]);
            pagePreview.addPageUrl(resp[5]);
            addBlogUrl(resp[3]);

            return {
                pinwall: resp[5],
                messages: resp[0],
                contacting: {users: resp[1], numberOfContacting: resp[2][0].numberOfContacting},
                blog: resp[3].sort(compare),
                user: {privacyTypes: resp[4], profileUrl: cdn.getUrl('profileImage/' + userId + '/profilePreview.jpg')}
            };
        });
};

module.exports = {
    getPinwall: getPinwall
};
