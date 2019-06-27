'use strict';

module.exports = ['$scope', 'FileReaderUtil', 'FileReader', 'Topics', 'Languages',
    function ($scope, FileReaderUtil, FileReader, Topics, Languages) {
        var ctrl = this, firstChangeSent = false;

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.dataOnServer = angular.copy(ctrl.data);

        ctrl.openImagePreview = function () {
            if (angular.isFunction(ctrl.eventShowImage)) {
                ctrl.eventShowImage();
            }
        };

        ctrl.dataChanged = function (isMultipleSelect) {
            if (angular.isFunction(ctrl.eventDataChanged)) {
                //Bugfix of ng-select multiple. ng-change is called at init.
                if (!(isMultipleSelect && ctrl.isEditMode && angular.equals(ctrl.dataOnServer, ctrl.data) && !firstChangeSent)) {
                    firstChangeSent = true;
                    ctrl.eventDataChanged(!angular.equals(ctrl.dataOnServer, ctrl.data), ctrl.manageGenericPageForm.$valid);
                }
            }
        };

        $scope.$watch('imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.data.imageForUploadPreview = FileReader.result;
                        ctrl.data.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.data.imageForUploadPreview);
                        ctrl.dataChanged();
                        ctrl.dataHasChanged = true;
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];
