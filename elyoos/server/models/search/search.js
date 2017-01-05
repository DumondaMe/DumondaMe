'use strict';

let searchPage = require('./../page/searchPage');
let pagePreview = require('./../page/pagePreview');
let searchUser = require('./../user/searchUser');
let userInfo = require('./../user/userInfo');
let _ = require('lodash');

let concatText = function (pages) {
    _.forEach(pages, function (page) {
        page.text = _.truncate(page.text, {length: 120});
    });
};

let search = function (userId, userQuery, maxItems, isSuggestion) {
    let commands = [];
    commands.push(searchUser.searchUsersQuery(userId, userQuery, maxItems, isSuggestion).getCommand());

    return searchPage.searchPageQuery(userId, userQuery, null, 0, maxItems)
        .send(commands).then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            userInfo.addContactPreviewInfos(resp[1]);
            pagePreview.addRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1], isSuggestion);
            concatText(resp[1]);

            return resp[0].concat(resp[1]);
        });
};

module.exports = {
    search: search
};
