'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var cdn = require('../util/cdn');
var userInfo = require('../user/userInfo');
var logger = requireLogger.getLogger(__filename);

var addPageUrl = function (previews) {
    underscore.forEach(previews, function (preview) {
        if (preview.subCategory !== 'Youtube') {
            preview.url = cdn.getUrl('pages/' + preview.label + '/' + preview.pageId + '/pagePreview.jpg');
            delete preview.link;
        }
    });
};

var addLabel = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.label = preview.types[0];
        delete preview.types;
    });
};

var addRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            summary: {
                numberOfRatings: preview.numberOfRatings,
                rating: preview.rating
            }
        };

        delete preview.numberOfRatings;
        delete preview.rating;
    });
};

var addContactRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            contact: {
                name: preview.name,
                rating: preview.rating,
                url: userInfo.getImageForPreview(preview, 'thumbnail.jpg')
            }
        };

        delete preview.profileVisible;
        delete preview.imageVisible;
        delete preview.rating;
        delete preview.name;
    });
};

var pagePreviewQuery = function (params, orderBy, startQuery) {

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.subCategory AS subCategory, " +
        "page.link AS link, numberOfRatings, rating, " +
        "EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end(params)
        .send()
        .then(function (resp) {
            addLabel(resp);
            addRecommendation(resp);
            addPageUrl(resp);
            return {pages: resp};
        });
};

var getFilterQuery = function (filters) {
    var filterQuery = '';
    if (filters) {
        underscore.forEach(filters, function (filter) {
            filterQuery += 'page:' + filter + ' OR ';
        });

        filterQuery = filterQuery.substring(0, filterQuery.length - 3);
    } else {
        filterQuery = "page:BookPage OR page:VideoPage OR page:SchoolPage OR page:CoursePage OR page:PracticePage OR " +
            "page:EventPage OR page:BlogPage OR page:StorePage";
    }
    return filterQuery;
};

var searchPage = function (userId, search, filterType, filterLanguage, isSuggestion) {

    var orderBy = "page.modified DESC",
        startQuery = db.cypher(),
        searchRegEx = '(?i).*'.concat(search, '.*'),
        filterQuery = getFilterQuery(filterType),
        filterLanguageQuery = '';

    if (filterLanguage) {
        filterLanguageQuery = "AND page.language = '" + filterLanguage + "'";
    }

    startQuery.match("(page)")
        .where("(" + filterQuery + ") AND page.title =~ {search} " + filterLanguageQuery)
        .with("page")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, count(rec) AS numberOfRatings, AVG(rec.rating) AS rating");

    return pagePreviewQuery({
        userId: userId,
        skip: 0,
        limit: 20,
        search: searchRegEx
    }, orderBy, startQuery);
};

var getRecommendationContacts = function (userId, skip, limit, filters) {

    var orderBy = "contactRec.created DESC",
        filterQuery = getFilterQuery(filters);

    return db.cypher().match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, max(contactRec.created) AS created")
        .match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(user:User {userId: {userId}})")
        .where("contactRec.created = created")
        .with("page, contactRec, contact, user, contactRec.rating AS rating")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("page, contactRec, contact, rating, rContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.subCategory AS subCategory, " +
        "page.link AS link, rating, contact.name AS name, contact.userId AS userId, privacy.profile AS profileVisible, privacy.image AS imageVisible, " +
        "EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            skip: skip,
            limit: limit
        })
        .send()
        .then(function (resp) {
            addLabel(resp);
            addContactRecommendation(resp);
            addPageUrl(resp);
            return {pages: resp};
        });
};

var getPopularPages = function (userId, skip, limit, onlyContact, pageType, subCategory) {

    var orderBy = "rating DESC, numberOfRatings DESC",
        startQuery = db.cypher(), matchQuery, subCategoryWhere = '';

    if (onlyContact) {
        matchQuery = "(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})";
    } else {
        matchQuery = "(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)";
    }

    if (subCategory) {
        subCategoryWhere = ' AND page.subCategory = {subCategory}';
    }

    startQuery.match(matchQuery)
        .where("page:" + pageType + subCategoryWhere)
        .with("page, AVG(contactRec.rating) AS rating, COUNT(contactRec) AS numberOfRatings");

    return pagePreviewQuery({
        userId: userId,
        skip: skip,
        limit: limit,
        subCategory: subCategory
    }, orderBy, startQuery);
};

module.exports = {
    getRecommendationContacts: getRecommendationContacts,
    getPopularPages: getPopularPages,
    searchPage: searchPage
};
