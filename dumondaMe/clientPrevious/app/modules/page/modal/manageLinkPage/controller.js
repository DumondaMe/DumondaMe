'use strict';

module.exports = ['ElyModal', 'Topics', 'LinkPageCreateMessageService', 'UploadPageService', 'Languages',
    function (ElyModal, Topics, LinkPageCreateMessageService, UploadPageService, Languages) {
        var ctrl = this, lastIsValid = true, imageChanged = false;
        ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
        ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages);

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.showImage = function () {
            ctrl.selectImage = true;
        };

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.setPreviewImage = function (blob, dataUri) {
            ctrl.selectImage = false;
            ctrl.data.dataUri = dataUri;
            ctrl.blob = blob;
            imageChanged = true;
            ctrl.dataChanged(true, lastIsValid);
        };

        ctrl.dataChanged = function (hasChanged, isValid) {
            ctrl.isValidToChange = hasChanged && isValid || isValid && imageChanged;
            lastIsValid = isValid;
        };

        ctrl.modifyLink = function () {
            var message = LinkPageCreateMessageService.getModifyLinkPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

