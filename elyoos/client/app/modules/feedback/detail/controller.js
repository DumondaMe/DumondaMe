'use strict';

module.exports = ['$stateParams', 'FeedbackDetail', 'dateFormatter', 'ElyModal',
    function ($stateParams, FeedbackDetail, dateFormatter, ElyModal) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.group = $stateParams.group;
        ctrl.commands = {};
        ctrl.orderComments = 'new';

        ctrl.detail = FeedbackDetail.get({feedbackId: $stateParams.feedbackId});

        ctrl.addedComment = function () {
            ctrl.detail.numberOfComments++;
        };

        ctrl.modifyFeedback = function () {
            ElyModal.show('FeedbackManageCtrl', 'app/modules/feedback/modal/manageFeedback/template.html',
                {
                    isEditMode: true, feedbackId: $stateParams.feedbackId, group: ctrl.group, title: ctrl.detail.title,
                    description: ctrl.detail.description
                })
                .then(function (resp) {
                    ctrl.detail.title = resp.title;
                    ctrl.detail.description = resp.description;
                    ctrl.detail.modified = resp.modified;
                });
        };
    }];
