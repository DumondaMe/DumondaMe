'use strict';

module.exports = ['ElyModal', 'CreateFeedback', 'CreateFeedbackMessage',
    function (ElyModal, CreateFeedback, CreateFeedbackMessage) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.uploadFeedback = function () {
            var message = CreateFeedbackMessage.getCreateFeedbackMessage(ctrl.title, ctrl.description, ctrl.group);
            ctrl.uploadRunning = true;
            delete ctrl.error;
            CreateFeedback.save(message, function (resp) {
                resp.createdByUser = true;
                resp.title = ctrl.title;
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

