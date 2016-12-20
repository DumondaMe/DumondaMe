'use strict';

module.exports = ['ElyModal', 'FeedbackClose', 'FeedbackReopen',
    function (ElyModal, FeedbackClose, FeedbackReopen) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };

        ctrl.getService = function (action) {
            if (action === 'reopen') {
                return FeedbackReopen;
            }
            return FeedbackClose;
        };

        ctrl.changeStatus = function () {
            ctrl.uploadRunning = true;
            delete ctrl.error;
            ctrl.getService(ctrl.action).save({feedbackId: ctrl.feedbackId, reasonText: ctrl.reasonText}, function (resp) {
                resp.title = ctrl.title;
                ctrl.uploadRunning = false;
                ElyModal.hide(resp);
            }, function () {
                ctrl.error = "Fehler beim ändern des Status";
                ctrl.uploadRunning = false;
            });
        };
    }];

