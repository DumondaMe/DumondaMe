'use strict';

module.exports = ['$scope', 'FileReaderUtil', 'FileReader', 'CheckPageExists', 'Topics', 'Languages',
    'DateFormatCheckService',
    function ($scope, FileReaderUtil, FileReader, CheckPageExists, Topics, Languages, DateFormatCheckService) {
        var ctrl = this, firstChangeSent = false;

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.getDateExample = DateFormatCheckService.getDateExample;
        ctrl.dataOnServer = angular.copy(ctrl.data);
        CheckPageExists.reset();

        ctrl.openImagePreview = function () {
            if (angular.isFunction(ctrl.eventShowImage)) {
                ctrl.eventShowImage();
            }
        };

        ctrl.titleLostFocus = function () {
            ctrl.checkPageExists();
        };

        ctrl.titleHasChanged = function () {
            if (ctrl.data.title && ctrl.data.title.length > 10) {
                ctrl.checkPageExists();
            }
            ctrl.dataChanged();
        };

        ctrl.checkPageExists = function () {
            return CheckPageExists.checkPageExists(ctrl.data.title, 'Book').then(function (result) {
                ctrl.searchResult = result.searchResult;
                ctrl.pageExists = result.pageExists;
            });
        };

        ctrl.publishDateChanged = function () {
            if (ctrl.data.publishDate && ctrl.data.publishDate.trim() !== "") {
                ctrl.manageBookPageForm.publishDate.$setValidity('ely-date', DateFormatCheckService.isDateValid(ctrl.data.publishDate));
            } else {
                delete ctrl.data.publishDate;
                ctrl.manageBookPageForm.publishDate.$setValidity('ely-date', true);
            }
            ctrl.dataChanged();
        };

        ctrl.dataChanged = function (isMultipleSelect) {
            if (angular.isFunction(ctrl.eventDataChanged)) {
                //Bugfix of ng-select multiple. ng-change is called at init.
                if (!(isMultipleSelect && ctrl.isEditMode && angular.equals(ctrl.dataOnServer, ctrl.data) && !firstChangeSent)) {
                    firstChangeSent = true;
                    ctrl.eventDataChanged(!angular.equals(ctrl.dataOnServer, ctrl.data), ctrl.manageBookPageForm.$valid);
                }
            }
        };

        ctrl.eventShowExistingOverview = function () {
            if (angular.isFunction(ctrl.eventShowExistingBooks)) {
                ctrl.eventShowExistingBooks(ctrl.searchResult);
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
