'use strict';

module.exports = ['$state', '$stateParams', 'FeedbackDiscussionOverview', 'ScrollRequest', 'FeedbackDiscussionScrollRequestResponseHandler',
    'ElyModal', '$mdDialog', 'FeedbackDeleteDiscussion', 'errorToast',
    function ($state, $stateParams, FeedbackDiscussionOverview, ScrollRequest, FeedbackDiscussionScrollRequestResponseHandler, ElyModal, $mdDialog,
              FeedbackDeleteDiscussion, errorToast) {
        var ctrl = this;

        ctrl.order = 'newestModification';
        ctrl.orderPrevious = ctrl.order;

        ctrl.nextFeedback = function () {
            ScrollRequest.nextRequest('FeedbackDiscussionOverview', ctrl.overview.feedback, {
                discussionId: $stateParams.discussionId,
                order: ctrl.order
            }).then(function (feedback) {
                ctrl.overview = feedback;
            });
        };

        ctrl.initNextFeedback = function () {
            ctrl.overview = {feedback: []};
            ScrollRequest.reset('FeedbackDiscussionOverview', FeedbackDiscussionOverview.get, FeedbackDiscussionScrollRequestResponseHandler);
            ctrl.nextFeedback();
        };

        ctrl.initNextFeedback();

        ctrl.filterChanged = function () {
            if (ctrl.order !== ctrl.orderPrevious) {
                ctrl.orderPrevious = ctrl.order;
                ctrl.initNextFeedback();
            }
        };

        ctrl.modifyDiscussion = function () {
            ElyModal.show('DiscussionManageCtrl', 'app/modules/feedback/modal/manageDiscussion/template.html', {
                isEditMode: true, feedbackId: $stateParams.discussionId, title: ctrl.overview.discussion.title,
                description: ctrl.overview.discussion.description
            }).then(function (resp) {
                ctrl.overview.discussion.title = resp.title;
                ctrl.overview.discussion.description = resp.description;
                ctrl.overview.discussion.lastModified = resp.modified;
            });
        };

        ctrl.deleteDiscussion = function () {
            var confirm = $mdDialog.confirm()
                .title("Diskussion löschen")
                .textContent("Willst Du diese Diskussion wirklich löschen?")
                .ariaLabel("Delete discussion")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                FeedbackDeleteDiscussion.delete({
                    discussionId: $stateParams.discussionId
                }, function () {
                    $state.go('feedback');
                }, function () {
                    errorToast.showError("Fehler beim Löschen der Discussion");
                });
            });
        };
    }];
