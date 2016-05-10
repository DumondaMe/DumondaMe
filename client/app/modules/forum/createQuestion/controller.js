'use strict';

module.exports = ['userInfo', '$mdDialog', 'CreateForumQuestionCheck', 'UploadForumQuestion', 'Categories', 'Languages', 'errorToast',
    function (userInfo, $mdDialog, CreateForumQuestionCheck, UploadForumQuestion, Categories, Languages, errorToast) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();

        ctrl.categories = Categories.categories;
        ctrl.languages = Languages.languages;

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.uploadQuestion = function () {
            if (ctrl.sendAllowed && !ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadForumQuestion.upload(ctrl.questionText, ctrl.selectedCategories, ctrl.selectedLanguage).then(function (resp) {
                    $mdDialog.hide(resp);
                }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Frage konnte nicht erstellt werden');
                });
            }
        };
        
        ctrl.changed = function () {
            ctrl.sendAllowed = CreateForumQuestionCheck.isSendQuestionAllowed(ctrl.questionText, ctrl.selectedCategories, ctrl.selectedLanguage);
        };
    }];

