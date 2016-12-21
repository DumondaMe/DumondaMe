'use strict';

module.exports = ['$scope', '$stateParams', 'FeedbackDetailComment', 'dateFormatter', 'ElyModal', 'ScrollRequest', 'FeedbackCommentsResponseHandler',
    function ($scope, $stateParams, FeedbackDetailComment, dateFormatter, ElyModal, ScrollRequest, FeedbackCommentsResponseHandler) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.comments = {comments: []};

        ScrollRequest.reset('feedbackComments', FeedbackDetailComment.get, FeedbackCommentsResponseHandler);
        ctrl.nextFeedbackComments = function () {
            ScrollRequest.nextRequest('feedbackComments', ctrl.comments.comments, {feedbackId: $stateParams.feedbackId, orderBy: $scope.orderBy})
                .then(function (comments) {
                    ctrl.loadRunning = false;
                    ctrl.comments = comments;
                });
        };

        $scope.$watch('orderBy', function (newOrderBy) {
            if (newOrderBy === 'new' || newOrderBy === 'old') {
                ctrl.comments = {comments: []};
                ScrollRequest.reset('feedbackComments', FeedbackDetailComment.get, FeedbackCommentsResponseHandler);
                ctrl.nextFeedbackComments();
            }
        });

        if (angular.isObject(ctrl.commands)) {
            ctrl.commands.createComment = function () {
                ElyModal.show('FeedbackCreateCommentCtrl', 'app/modules/feedback/modal/createFeedbackComment/template.html',
                    {feedbackId: $stateParams.feedbackId}).then(function (resp) {
                    ctrl.comments.comments.unshift(resp);
                    ScrollRequest.addedElement('feedbackComments');
                    ctrl.addedComment();
                });
            };
            ctrl.commands.addStatus = function (status) {
                ctrl.comments.comments.unshift(status);
                ScrollRequest.addedElement('feedbackComments');
            };
            ctrl.commands.nextFeedbackComments = ctrl.nextFeedbackComments;
        }
    }];
