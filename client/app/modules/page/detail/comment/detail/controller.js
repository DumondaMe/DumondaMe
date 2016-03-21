'use strict';

module.exports = ['PageDetailComments', '$stateParams', 'moment',
    function (PageDetailComments, $stateParams, moment) {
        var ctrl = this;

        ctrl.getComments = function (skip, maxItems) {
            ctrl.comments = PageDetailComments.get({
                onlyContacts: ctrl.onlyContact,
                pageId: $stateParams.pageId,
                skip: skip,
                maxItems: maxItems
            });
        };
        ctrl.getComments(0, 4);

        ctrl.getDate = function (date) {
            return moment.unix(date).format('l');
        };
    }];

