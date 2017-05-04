'use strict';

module.exports = ['ElyModal', 'BookPageCreateMessageService', 'UploadPageService', 'moment', 'Topics', 'Languages',
    function (ElyModal, BookPageCreateMessageService, UploadPageService, moment, Topics, Languages) {
        var ctrl = this, lastIsValid = true, imageChanged = false;
        if (angular.isNumber(ctrl.data.publishDate)) {
            ctrl.data.publishDate = moment.unix(ctrl.data.publishDate).format('l');
        }
        ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
        ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages)[0];

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
            imageChanged = true;
            ctrl.dataChanged(true, lastIsValid);
        };

        ctrl.showImage = function () {
            ctrl.selectImage = true;
        };

        ctrl.dataChanged = function (hasChanged, isValid) {
            ctrl.isValidToChange = hasChanged && isValid || isValid && imageChanged;
            lastIsValid = isValid;
        };

        ctrl.modifyBook = function () {
            var message = BookPageCreateMessageService.getModifyBookPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

