'use strict';

module.exports = ['$log', 'ElyModal', 'ForumQuestionAnswer', 'errorToast',
    function ($log, ElyModal, ForumQuestionAnswer, errorToast) {
        var ctrl = this;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };
        
        ctrl.createAnswer = function () {
            ctrl.uploadStarted = true;
            if(ctrl.isExplanation) {
                ForumQuestionAnswer.save({questionId: ctrl.questionId, description: ctrl.answer, type: 'explanation'}).$promise.then(function () {
                    ElyModal.hide();
                }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Erkärung konnte nicht hochgeladen werden');
                });
            } else if(ctrl.isSolution) {
                ForumQuestionAnswer.save({questionId: ctrl.questionId, description: ctrl.answer, type: 'solution'}).$promise.then(function () {
                    ElyModal.hide();
                }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Lösungsvorschlag konnte nicht hochgeladen werden');
                });
            } else {
                $log.error("Missing correct type for question answer");
            }
        };
    }];

