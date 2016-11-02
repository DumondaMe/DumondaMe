'use strict';

module.exports = ['ElyModal', 'Topics', 'PlacePageCreateMessageService', 'fileUpload', 'CheckPageExists', 'UploadPageService',
    'RecommendationResponseFormatter', 'Languages', 'ArrayHelper',
    function (ElyModal, Topics, PlacePageCreateMessageService, fileUpload, CheckPageExists, UploadPageService, RecommendationResponseFormatter,
              Languages, ArrayHelper) {
        var ctrl = this;

        ctrl.languages = Languages.languages;
        CheckPageExists.reset();
        ctrl.topics = Topics.topics;
        ctrl.data = {selectedPlaces: []};

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.searchKeyword = function (text) {

        };

        ctrl.transformChip = function (chip) {
            return chip;
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

        ctrl.addPlace = function () {
            ctrl.showAddPlace = true;
        };

        ctrl.deletePlace = function (placeToDelete) {
            ArrayHelper.removeElementByObject(ctrl.data.selectedPlaces, placeToDelete);
        };

        ctrl.closeAddPlace = function () {
            ctrl.showAddPlace = false;
        };

        ctrl.placeSelected = function (selectedPlace) {
            ctrl.showAddPlace = false;
            ctrl.data.selectedPlaces.push(selectedPlace);
            selectedPlace.number = ctrl.data.selectedPlaces.length;
        };

        ctrl.createPlace = function () {
            var message = PlacePageCreateMessageService.getCreatePlacePageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl);
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

