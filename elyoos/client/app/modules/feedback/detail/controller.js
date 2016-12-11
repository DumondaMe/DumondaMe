'use strict';

module.exports = ['$stateParams', 'FeedbackDetail', 'dateFormatter',
    function ($stateParams, FeedbackDetail, dateFormatter) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.group = $stateParams.group;
        ctrl.commands = {};
        ctrl.orderComments = 'new';

        ctrl.detail = FeedbackDetail.get({feedbackId: $stateParams.feedbackId});

        ctrl.addedComment = function () {
            ctrl.detail.numberOfComments++;
        };

    }];
