'use strict';

module.exports = ['ElyModal', 'CreateDiscussion', 'EditDiscussion', 'CreateDiscussionMessage',
    function (ElyModal, CreateDiscussion, EditDiscussion, CreateDiscussionMessage) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.getService = function (isEditMode) {
            if (isEditMode) {
                return EditDiscussion;
            }
            return CreateDiscussion;
        };

        ctrl.originalTitle = ctrl.title;
        ctrl.originalDescription = ctrl.description;

        ctrl.uploadFeedback = function () {
            var message = CreateDiscussionMessage.getDiscussionMessage(ctrl.isEditMode, ctrl.title, ctrl.description, ctrl.feedbackId);
            ctrl.uploadRunning = true;
            delete ctrl.error;
            ctrl.getService(ctrl.isEditMode).save(message, function (resp) {
                resp.title = ctrl.title;
                resp.description = ctrl.description;
                if (!ctrl.isEditMode) {
                    resp.numberOfIdeas = 0;
                }
                resp.type = 'Discussion';
                ctrl.uploadRunning = false;
                ElyModal.hide(resp);
            }, function () {
                ctrl.error = "Fehler beim erstellen der Diskussion";
                ctrl.uploadRunning = false;
            });
        };
    }];

