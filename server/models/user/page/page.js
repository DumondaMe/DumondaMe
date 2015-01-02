/**
 * Handles the page of a user
 */
'use strict';

var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);
var db = require('./../../../lib/database').client;
var operation = require('../../security/operation');

var getPages = function (userId) {
    return db().search({
        index: 'pages',
        type: 'page',
        body: {
            query: {
                filtered: {
                    filter: {
                        term: {"administrators.id": userId}
                    }
                }
            }
        }
    }).then(function (resp) {
        //return converter.convertResponse(resp.hits.hits);
    });
};

var createPage = function (userId, page) {
    return db().get({
        index: 'users',
        type: 'user',
        _sourceInclude: ['forename', 'surname'],
        id: userId
    }).then(function (resp) {

        page.administrators = [];
        page.administrators.push({
            id: userId,
            name: resp._source.forename + resp._source.surname
        });

        return db().create({
            index: 'pages',
            type: 'page',
            body: page
        });
    });
};

module.exports = {
    getPages: getPages,
    createPage: createPage
};