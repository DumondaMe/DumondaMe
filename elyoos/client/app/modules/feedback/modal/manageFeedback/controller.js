'use strict';

module.exports = ['ElyModal', 'FeedbackServiceManager', 'CreateFeedbackMessage',
    function (ElyModal, FeedbackServiceManager, CreateFeedbackMessage) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.disableUpload = ctrl.data.isEditMode;

        if (ctrl.data.isEditMode) {
            ctrl.dataOriginal = {};
            angular.copy(ctrl.data, ctrl.dataOriginal);
        } else {
            ctrl.data.browser = 'firefox';
            ctrl.data.screen = 'desktop';
            ctrl.data.operatingSystem = 'windows';
        }

        ctrl.changedInEditMode = function () {
            if (ctrl.data.isEditMode) {
                ctrl.disableUpload = angular.equals(ctrl.data, ctrl.dataOriginal);
            }
        };

        ctrl.uploadFeedback = function () {
            var message = CreateFeedbackMessage.createFeedbackMessage(ctrl.data.isEditMode, ctrl.data.group, ctrl.data.feedbackId, ctrl.data.title,
                ctrl.data.description, ctrl.data.screen, ctrl.data.operatingSystem, ctrl.data.browser);
            ctrl.uploadRunning = true;
            delete ctrl.error;
            FeedbackServiceManager.getService(ctrl.data.isEditMode, ctrl.data.group).save(message, function (resp) {
                resp.createdByUser = true;
                resp.title = ctrl.data.title;
                resp.description = ctrl.data.description;
                resp.operatingSystem = ctrl.data.operatingSystem;
                resp.screen = ctrl.data.screen;
                resp.browser = ctrl.data.browser;
                if (!ctrl.isEditMode) {
                    resp.numberOfComments = 0;
                    resp.numberOfIdeas = 0;
                    resp.numberOfRecommendations = 0;
                }
                ctrl.uploadRunning = false;
                ElyModal.hide(resp);
            }, function () {
                ctrl.error = "Fehler beim erstellen";
                ctrl.uploadRunning = false;
            });
        };
    }];

