'use strict';

module.exports = ['PageDetailComments', '$stateParams', 'moment', 'UserDetailNavigation',
    function (PageDetailComments, $stateParams, moment, UserDetailNavigation) {
        var ctrl = this;

        ctrl.skip = 0;
        ctrl.maxItems = 4;
        ctrl.running = false;

        ctrl.getComments = function (skip) {
            ctrl.running = true;
            ctrl.comments = PageDetailComments.get({
                onlyContacts: ctrl.onlyContact,
                pageId: $stateParams.pageId,
                skip: skip,
                maxItems: ctrl.maxItems
            }, function () {
                ctrl.running = false;
            });
        };
        ctrl.getComments(ctrl.skip);

        ctrl.getNext = function () {
            ctrl.skip = ctrl.skip + ctrl.maxItems;
            ctrl.getComments(ctrl.skip);
        };

        ctrl.getPrevious = function () {
            ctrl.skip = ctrl.skip - ctrl.maxItems;
            ctrl.getComments(ctrl.skip);
        };

        ctrl.getDate = function (date) {
            return moment.unix(date).format('l');
        };

        ctrl.goToUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };
    }];

