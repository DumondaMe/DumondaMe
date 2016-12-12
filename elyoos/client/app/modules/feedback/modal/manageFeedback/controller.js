'use strict';

module.exports = ['ElyModal', 'CreateFeedback', 'EditFeedback', 'CreateFeedbackMessage',
    function (ElyModal, CreateFeedback, EditFeedback, CreateFeedbackMessage) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.getService = function (isEditMode) {
            if (isEditMode) {
                return EditFeedback;
            }
            return CreateFeedback;
        };

        ctrl.originalTitle = ctrl.title;
        ctrl.originalDescription = ctrl.description;

        ctrl.uploadFeedback = function () {
            var message = CreateFeedbackMessage.getCreateFeedbackMessage(ctrl.isEditMode, ctrl.title, ctrl.description, ctrl.group, ctrl.feedbackId);
            ctrl.uploadRunning = true;
            delete ctrl.error;
            ctrl.getService(ctrl.isEditMode).save(message, function (resp) {
                resp.createdByUser = true;
                resp.title = ctrl.title;
                resp.description = ctrl.description;
                resp.numberOfComments = 0;
                resp.numberOfIdeas = 0;
                resp.numberOfRecommendations = 0;
                ctrl.uploadRunning = false;
                ElyModal.hide(resp);
            }, function () {
                ctrl.error = "Fehler beim erstellen";
                ctrl.uploadRunning = false;
            });
        };
    }];

