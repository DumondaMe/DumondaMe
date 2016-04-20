'use strict';

var searchPage = require('./../page/searchPage');
var pagePreview = require('./../page/pagePreview');
var searchUser = require('./../user/searchUser');
var userInfo = require('./../user/userInfo');

var search = function (userId, userQuery, maxItems) {
    var commands = [];
    commands.push(searchUser.searchUsersQuery(userId, userQuery, maxItems).getCommand());

    return searchPage.searchPageQuery(userId, userQuery, null, 0, maxItems)
        .send(commands).then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            pagePreview.addRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {users: resp[0], pages: resp[1]};
        });
};

module.exports = {
    search: search
};
