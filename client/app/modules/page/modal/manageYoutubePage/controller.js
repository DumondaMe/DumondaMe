'use strict';

module.exports = ['ElyModal', 'Topics', 'PageYoutubeLink', 'fileUpload', 'errorToast', 'YoutubePageCreateMessageService', 'UploadPageService',
    'CheckPageExists', 'RecommendationResponseFormatter', 'Languages',
    function (ElyModal, Topics, PageYoutubeLink, fileUpload, errorToast, YoutubePageCreateMessageService, UploadPageService, CheckPageExists,
              RecommendationResponseFormatter, Languages) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
            ctrl.data.selectedLanguages = Languages.getLanguages(ctrl.data.selectedLanguages);
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        ctrl.languages = Languages.languages;
        CheckPageExists.reset();

        ctrl.topics = Topics.topics;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.titleHasChanged = function () {
            if (ctrl.data.title && ctrl.data.title.length > 10) {
                ctrl.checkPageExists(ctrl.data.title);
            }
        };

        ctrl.linkHasChanged = function () {
            var validLink = PageYoutubeLink.isValidYoutubeLink(ctrl.data.link);
            ctrl.manageYoutubePageForm.link.$setValidity('ely-invalid-link', validLink);
            
            if (validLink) {
                ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
                ctrl.youtubeLinkFormatted = PageYoutubeLink.getYoutubeLink(ctrl.data.link);
                ctrl.checkPageExists(ctrl.youtubeLinkFormatted);
            }
        };

        ctrl.checkPageExists = function (query) {
            return CheckPageExists.checkPageExists(query, 'Youtube').then(function (result) {
                ctrl.searchResult = result.searchResult;
                ctrl.pageExists = result.pageExists;
            });
        };

        ctrl.changeData = function () {
            ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
        };

        ctrl.closeOverviewPages = function () {
            ctrl.showExistingPages = false;
        };

        ctrl.createYoutube = function () {
            var message = YoutubePageCreateMessageService.getCreateYoutubePageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl).then(function () {
                ctrl.data.link = message.youtubePage.link;
            });
        };

        ctrl.modifyYoutube = function () {
            var message = YoutubePageCreateMessageService.getModifyYoutubePageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };

        ctrl.recommendationFinish = function (recommendation) {
            RecommendationResponseFormatter.format(ctrl.data, recommendation, 'Youtube');
            ElyModal.hide(ctrl.data);
        };

        ctrl.recommendationAbort = function () {
            ElyModal.cancel();
        };
    }];

