'use strict';

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
            ForumUploadAnswer.upload(ctrl.pageToReference, ctrl.questionId, ctrl.title, ctrl.description, ctrl.type).then(function (resp) {
                ElyModal.hide(resp);
            }).catch(function () {
                ctrl.uploadStarted = false;
                errorToast.showError('Hochladen der Antwort ist fehlgeschlagen');
            });
        };
    }];

