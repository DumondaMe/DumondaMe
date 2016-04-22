'use strict';

module.exports = ['ElyModal', 'Categories', 'PageYoutubeLink', 'fileUpload', 'errorToast', 'YoutubePageCreateMessageService', 'UploadPageService',
    'CheckPageExists', 'RecommendationResponseFormatter',
    function (ElyModal, Categories, PageYoutubeLink, fileUpload, errorToast, YoutubePageCreateMessageService, UploadPageService, CheckPageExists,
              RecommendationResponseFormatter) {
        var ctrl = this;

        if (ctrl.isEditMode) {
            ctrl.data.selectedCategories = Categories.getCategories(ctrl.data.selectedCategories);
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        CheckPageExists.reset();

        ctrl.categories = Categories.categories;

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
            UploadPageService.uploadCreatePage(message, ctrl);
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

