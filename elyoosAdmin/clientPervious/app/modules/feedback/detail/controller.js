'use strict';

module.exports = ['$stateParams', 'FeedbackDetail', 'dateFormatter', 'ElyModal', 'BrowserCode', 'OSCode', 'ScreenCode',
    function ($stateParams, FeedbackDetail, dateFormatter, ElyModal, BrowserCode, OSCode, ScreenCode) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.commands = {};
        ctrl.orderComments = 'new';

        ctrl.detail = FeedbackDetail.get({feedbackId: $stateParams.feedbackId}, function () {
            ctrl.browser =  BrowserCode.getBrowserDescription(ctrl.detail.browser);
            ctrl.screen =  ScreenCode.getScreenDescription(ctrl.detail.screen);
            ctrl.operatingSystem =  OSCode.getOSDescription(ctrl.detail.operatingSystem);
        });

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
