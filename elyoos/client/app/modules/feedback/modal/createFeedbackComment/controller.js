'use strict';

module.exports = ['ElyModal', 'CreateFeedbackComment', 'CreateFeedbackCommentMessage',
    function (ElyModal, CreateFeedbackComment, CreateFeedbackCommentMessage) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.uploadFeedbackComment = function () {
            var message = CreateFeedbackCommentMessage.getCreateFeedbackCommentMessage(ctrl.text, ctrl.feedbackId);
            ctrl.uploadRunning = true;
            delete ctrl.error;
            CreateFeedbackComment.save(message, function (resp) {
                ctrl.uploadRunning = false;
                ElyModal.hide(resp);
            }, function () {
                ctrl.error = "Fehler beim erstellen des Kommentars";
                ctrl.uploadRunning = false;
            });
        };
    }];

