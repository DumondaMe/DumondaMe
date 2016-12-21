'use strict';

module.exports = ['$stateParams', 'FeedbackDetail', 'dateFormatter', 'ElyModal', '$mdDialog', 'UserFeedback', 'errorToast', '$state',
    function ($stateParams, FeedbackDetail, dateFormatter, ElyModal, $mdDialog, UserFeedback, errorToast, $state) {
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
                    data: {
                        isEditMode: true, feedbackId: $stateParams.feedbackId, group: ctrl.group, title: ctrl.detail.title,
                        description: ctrl.detail.description, screen: ctrl.detail.screen, operatingSystem: ctrl.detail.operatingSystem,
                        browser: ctrl.detail.browser
                    }
                })
                .then(function (resp) {
                    ctrl.detail.title = resp.title;
                    ctrl.detail.description = resp.description;
                    ctrl.detail.modified = resp.modified;
                });
        };

        ctrl.deleteFeedback = function () {
            var confirm = $mdDialog.confirm()
                .title("Feedback löschen")
                .textContent("Willst du \"" + ctrl.detail.title + "\" wirklich löschen?")
                .ariaLabel("Delete Feedback")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                UserFeedback.delete({
                    feedbackId: $stateParams.feedbackId
                }, function () {
                    if (ctrl.group === 'DiscussionIdea') {
                        $state.go('feedback.overview', {group: ctrl.group, discussionId: ctrl.detail.discussion.discussionId});
                    } else {
                        $state.go('feedback.overview', {group: ctrl.group});
                    }
                }, function () {
                    errorToast.showError("Fehler beim Löschen des Feedbacks");
                });
            });
        };
    }];
