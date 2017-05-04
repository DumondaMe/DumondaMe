'use strict';

module.exports = ['ElyModal', 'Topics', 'YoutubePageCreateMessageService', 'UploadPageService', 'Languages',
    function (ElyModal, Topics, YoutubePageCreateMessageService, UploadPageService, Languages) {
        var ctrl = this;
        ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
        ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages);

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.closeOverviewPages = function () {
            ctrl.showExistingPages = false;
        };

        ctrl.dataChanged = function (hasChanged, isValid) {
            ctrl.isValidToChange = hasChanged && isValid;
        };

        ctrl.modifyYoutube = function () {
            var message = YoutubePageCreateMessageService.getModifyYoutubePageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

