'use strict';

module.exports = ['ElyModal', 'Categories', 'PageYoutubeLink', 'fileUpload', 'errorToast', 'YoutubePageCreateMessageService', 'UploadPageService',
    'CheckPageExists',
    function (ElyModal, Categories, PageYoutubeLink, fileUpload, errorToast, YoutubePageCreateMessageService, UploadPageService, CheckPageExists) {
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
                ctrl.checkPageExists();
            }
        };

        ctrl.linkHasChanged = function () {
            var validLink = PageYoutubeLink.isValidYoutubeLink(ctrl.data.link);
            ctrl.manageYoutubePageForm.link.$setValidity('ely-invalid-link', validLink);
            if (ctrl.data.link && ctrl.data.link.length > 10) {
                ctrl.checkPageExists();
            }
            if (validLink) {
                ctrl.youtubeLinkFormatted = PageYoutubeLink.getYoutubeLink(ctrl.data.link);
            }
        };

        ctrl.lostFocus = function () {
            ctrl.checkPageExists();
        };

        ctrl.checkPageExists = function () {
            return CheckPageExists.checkPageExists(ctrl.data.link, 'Youtube').then(function (result) {
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

        ctrl.recommendationFinish = function () {
            ElyModal.hide();
        };
    }];

