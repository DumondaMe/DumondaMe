'use strict';

module.exports = ['$stateParams', 'FeedbackDetail', 'dateFormatter', 'ElyModal',
    function ($stateParams, FeedbackDetail, dateFormatter, ElyModal) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.commands = {};
        ctrl.orderComments = 'new';

        ctrl.detail = FeedbackDetail.get({feedbackId: $stateParams.feedbackId});

        ctrl.addedComment = function () {
            ctrl.detail.numberOfComments++;
        };

        ctrl.closeDiscussion = function() {
            ElyModal.show('FeedbackManageStatusCtrl', 'app/modules/feedback/modal/manageFeedbackStatus/template.html', {
                action: 'close', feedbackId: $stateParams.feedbackId
            }).then(function (resp) {
                ctrl.detail.status  = 'closed';
                ctrl.commands.addStatus(resp);
            });
        };

        ctrl.reopenDiscussion = function() {
            ElyModal.show('FeedbackManageStatusCtrl', 'app/modules/feedback/modal/manageFeedbackStatus/template.html', {
                action: 'reopen', feedbackId: $stateParams.feedbackId
            }).then(function (resp) {
                ctrl.detail.status = 'open';
                ctrl.commands.addStatus(resp);
            });
        };
    }];
