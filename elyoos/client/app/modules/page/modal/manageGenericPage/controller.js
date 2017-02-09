'use strict';

module.exports = ['ElyModal', 'Topics', 'GenericPageCreateMessageService', 'UploadPageService', 'Languages',
    function (ElyModal, Topics, GenericPageCreateMessageService, UploadPageService, Languages) {
        var ctrl = this;

        ctrl.languages = Languages.languages;
        ctrl.topics = Topics.topics;
        if (ctrl.isEditMode) {
            ctrl.actualTitle = angular.copy(ctrl.data.title);
            ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
            ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages);
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.setPreviewImage = function (blob, dataUri) {
            ctrl.selectImage = false;
            ctrl.data.dataUri = dataUri;
            ctrl.blob = blob;
            ctrl.changeData();
        };

        ctrl.changeData = function () {
            ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
        };

        ctrl.closeOverviewPages = function () {
            ctrl.showExistingPages = false;
        };

        ctrl.createGenericPage = function () {
            var message = GenericPageCreateMessageService.getCreateGenericPageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl);
        };

        ctrl.editGenericPage = function () {
            var message = GenericPageCreateMessageService.getEditGenericPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

