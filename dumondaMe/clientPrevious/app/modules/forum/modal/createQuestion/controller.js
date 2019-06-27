'use strict';

module.exports = ['userInfo', 'ElyModal', 'CreateForumQuestionCheck', 'UploadForumQuestion', 'Topics', 'Languages', 'errorToast',
    function (userInfo, ElyModal, CreateForumQuestionCheck, UploadForumQuestion, Topics, Languages, errorToast) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.uploadQuestion = function () {
            if (ctrl.sendAllowed && !ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadForumQuestion.upload(ctrl.questionText, ctrl.selectedTopics, ctrl.selectedLanguage).then(function (resp) {
                    ElyModal.hide(resp);
                }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Frage konnte nicht erstellt werden');
                });
            }
        };

        ctrl.changed = function () {
            ctrl.sendAllowed = CreateForumQuestionCheck.isSendQuestionAllowed(ctrl.questionText, ctrl.selectedTopics, ctrl.selectedLanguage);
        };
    }];
