'use strict';

module.exports = ['ElyModal', 'Topics', 'GenericPageCreateMessageService', 'fileUpload', 'CheckPageExists', 'UploadPageService',
    'RecommendationResponseFormatter', 'Languages', 'ArrayHelper',
    function (ElyModal, Topics, GenericPageCreateMessageService, fileUpload, CheckPageExists, UploadPageService, RecommendationResponseFormatter,
              Languages, ArrayHelper) {
        var ctrl = this;

        ctrl.languages = Languages.languages;
        CheckPageExists.reset();
        ctrl.topics = Topics.topics;
        ctrl.data = {selectedPlaces: []};

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
        };

        ctrl.createGenericPage = function () {
            var message = GenericPageCreateMessageService.getCreateGenericPageMessage(ctrl.data);
            UploadPageService.uploadCreatePage(message, ctrl);
        };

        ctrl.modifyGenericPage = function () {
            var message = GenericPageCreateMessageService.getModifyGenericPageMessage(ctrl.data);
            UploadPageService.uploadModifyPage(message, ctrl);
        };
    }];

