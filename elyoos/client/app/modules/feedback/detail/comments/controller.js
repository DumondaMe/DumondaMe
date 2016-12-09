'use strict';

module.exports = ['$stateParams', 'FeedbackDetailComment', 'dateFormatter', 'ElyModal', 'ScrollRequest', 'FeedbackCommentsResponseHandler',
    function ($stateParams, FeedbackDetailComment, dateFormatter, ElyModal, ScrollRequest, FeedbackCommentsResponseHandler) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.group = $stateParams.group;
        ctrl.comments = {comments: []};

        ScrollRequest.reset('feedbackComments', FeedbackDetailComment.get, FeedbackCommentsResponseHandler);
        ctrl.nextFeedbackComments = function () {
            ScrollRequest.nextRequest('feedbackComments', ctrl.comments.comments, {feedbackId: $stateParams.feedbackId})
                .then(function (comments) {
                    ctrl.loadRunning = false;
                    ctrl.comments = comments;
                });
        };
        ctrl.nextFeedbackComments();

        if (angular.isObject(ctrl.commands)) {
            ctrl.commands.createComment = function () {
                ElyModal.show('FeedbackCreateCommentCtrl', 'app/modules/feedback/modal/createFeedbackComment/template.html',
                    {feedbackId: $stateParams.feedbackId}).then(function (resp) {
                    ctrl.comments.comments.unshift(resp);
                    ScrollRequest.addedElement('feedbackComments');
                });
            };
            ctrl.commands.nextFeedbackComments = ctrl.nextFeedbackComments;
        }
    }];
