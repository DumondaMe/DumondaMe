'use strict';

var uploadAnswer = function (ForumUploadAnswer, ElyModal, errorToast, ctrl, type, errorDescription) {
    ForumUploadAnswer.upload(ctrl.pageToReference, ctrl.questionId, ctrl.title, ctrl.description, type).then(function (resp) {
        ElyModal.hide(resp);
    }).catch(function () {
        ctrl.uploadStarted = false;
        errorToast.showError(errorDescription);
    });
};

module.exports = ['$log', 'ElyModal', 'errorToast', 'ForumUploadAnswer',
    function ($log, ElyModal, errorToast, ForumUploadAnswer) {
        var ctrl = this;
        ctrl.pageToReference = {};

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.cancelSelectPage = function () {
            ctrl.selectPage = false;
        };

        ctrl.finishSelectPage = function (page) {
            ctrl.pageToReference = page;
            ctrl.selectPage = false;
        };

        ctrl.createAnswer = function () {
            ctrl.uploadStarted = true;
            if (ctrl.isExplanation) {
                uploadAnswer(ForumUploadAnswer, ElyModal, errorToast, ctrl, 'explanation', 'Erklärung konnte nicht hochgeladen werden');
            } else if (ctrl.isSolution) {
                uploadAnswer(ForumUploadAnswer, ElyModal, errorToast, ctrl, 'solution', 'Lösungsvorschlag konnte nicht hochgeladen werden');
            } else {
                $log.error("Missing correct type for question answer");
            }
        };
    }];

