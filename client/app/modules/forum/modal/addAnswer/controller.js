'use strict';

var uploadAnswer = function (ForumQuestionAnswer, ElyModal, errorToast, ctrl, type, errorDescription) {
    ForumQuestionAnswer.save({
        questionId: ctrl.questionId,
        description: ctrl.answer,
        type: type,
        pageId: ctrl.pageToReference.pageId
    }).$promise.then(function () {
        ElyModal.hide();
    }).catch(function () {
        ctrl.uploadStarted = false;
        errorToast.showError(errorDescription);
    });
};

module.exports = ['$log', 'ElyModal', 'ForumQuestionAnswer', 'errorToast',
    function ($log, ElyModal, ForumQuestionAnswer, errorToast) {
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
                uploadAnswer(ForumQuestionAnswer, ElyModal, errorToast, ctrl, 'explanation', 'Erklärung konnte nicht hochgeladen werden');
            } else if (ctrl.isSolution) {
                uploadAnswer(ForumQuestionAnswer, ElyModal, errorToast, ctrl, 'solution', 'Lösungsvorschlag konnte nicht hochgeladen werden');
            } else {
                $log.error("Missing correct type for question answer");
            }
        };
    }];

