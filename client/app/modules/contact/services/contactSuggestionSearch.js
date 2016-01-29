'use strict';

module.exports = ['SearchUsers', function (SearchUsers) {

    this.querySearch = function (text) {
        if (text && text.trim().length > 0) {
            return SearchUsers.query({
                search: text,
                maxItems: 7,
                isSuggestion: true
            }).$promise;
        }
    };
}];
