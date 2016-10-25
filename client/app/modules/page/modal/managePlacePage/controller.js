'use strict';

module.exports = ['ElyModal', 'Topics', 'PlacePageCreateMessageService', 'fileUpload', 'CheckPageExists', 'UploadPageService',
    'RecommendationResponseFormatter', 'Languages',
    function (ElyModal, Topics, PlacePageCreateMessageService, fileUpload, CheckPageExists, UploadPageService, RecommendationResponseFormatter,
              Languages) {
        var ctrl = this;

        ctrl.languages = Languages.languages;
        CheckPageExists.reset();
        ctrl.topics = Topics.topics;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.titleHasChanged = function () {
            if (ctrl.data.title && ctrl.data.title.length > 10) {
                ctrl.checkPageExists();
            }
        };

        ctrl.titleLostFocus = function () {
            ctrl.checkPageExists();
        };

        ctrl.checkPageExists = function () {
            return CheckPageExists.checkPageExists(ctrl.data.title, 'Book').then(function (result) {
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

        ctrl.addPlace = function () {
            ctrl.showAddPlace = true;
        };

        ctrl.closeAddPlace = function () {
            ctrl.showAddPlace = false;
        };

        ctrl.createPlace = function () {
            var message = PlacePageCreateMessageService.getCreatePlacePageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl).then(function (resp) {
                ctrl.data.bookPreviewUrl = resp.data.bookPreviewUrl;
            });
        };

        ctrl.modifyPlace = function () {
            var message = PlacePageCreateMessageService.getModifyPlacePageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };

        ctrl.recommendationFinish = function (recommendation) {
            RecommendationResponseFormatter.format(ctrl.data, recommendation, 'Place');
            ElyModal.hide(ctrl.data);
        };

        ctrl.recommendationAbort = function () {
            ElyModal.cancel();
        };
    }];

