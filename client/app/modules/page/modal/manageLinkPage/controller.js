'use strict';

module.exports = ['ElyModal', 'Categories', 'PageLinkUrlCheck', 'fileUpload', 'LinkPageCreateMessageService', 'UploadPageService',
    'CheckPageExists', 'RecommendationResponseFormatter',
    function (ElyModal, Categories, PageLinkUrlCheck, fileUpload, LinkPageCreateMessageService, UploadPageService, CheckPageExists,
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

        ctrl.cancelPreviewImage = function () {
            ctrl.selectImage = false;
        };

        ctrl.setPreviewImage = function (blob, dataUri) {
            ctrl.selectImage = false;
            ctrl.data.dataUri = dataUri;
            ctrl.blob = blob;
            ctrl.changeData();
        };

        ctrl.linkHasChanged = function () {
            ctrl.checkPageExists(ctrl.data.link);
        };

        ctrl.checkPageExists = function (query) {
            return CheckPageExists.checkPageExists(query, 'Link').then(function (result) {
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

        ctrl.createLink = function () {
            var message = LinkPageCreateMessageService.getCreateLinkPageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl);
        };

        ctrl.modifyLink = function () {
            var message = LinkPageCreateMessageService.getModifyLinkPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };

        ctrl.recommendationFinish = function (recommendation) {
            RecommendationResponseFormatter.format(ctrl.data, recommendation, 'Link');
            ElyModal.hide(ctrl.data);
        };

        ctrl.recommendationAbort = function () {
            ElyModal.cancel();
        };
    }];

