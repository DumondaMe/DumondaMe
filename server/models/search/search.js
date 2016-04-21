'use strict';

var searchPage = require('./../page/searchPage');
var pagePreview = require('./../page/pagePreview');
var searchUser = require('./../user/searchUser');
var userInfo = require('./../user/userInfo');

var search = function (userId, userQuery, maxItems, isSuggestion) {
    var commands = [];
    commands.push(searchUser.searchUsersQuery(userId, userQuery, maxItems, isSuggestion).getCommand());

    return searchPage.searchPageQuery(userId, userQuery, null, 0, maxItems)
        .send(commands).then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            pagePreview.addRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);

            return resp[0].concat(resp[1]);
        });
};

module.exports = {
    search: search
};
