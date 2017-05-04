'use strict';

module.exports = ['$scope', 'FileReaderUtil', 'FileReader', 'CheckPageExists', 'Topics', 'Languages',
    'PageLinkUrlCheck',
    function ($scope, FileReaderUtil, FileReader, CheckPageExists, Topics, Languages, PageLinkUrlCheck) {
        var ctrl = this, firstChangeSent = false;

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.dataOnServer = angular.copy(ctrl.data);
        CheckPageExists.reset();

        ctrl.openImagePreview = function () {
            if (angular.isFunction(ctrl.eventShowImage)) {
                ctrl.eventShowImage();
            }
        };

        ctrl.checkPageExists = function (query) {
            return CheckPageExists.checkPageExists(query, 'Link').then(function (result) {
                ctrl.searchResult = result.searchResult;
                ctrl.pageExists = result.pageExists;
            });
        };

        ctrl.linkHasChanged = function () {
            ctrl.manageLinkPageForm.link.$setValidity('youtube-link', true);
            if(PageLinkUrlCheck.isYoutubeLink(ctrl.data.link)) {
                ctrl.manageLinkPageForm.link.$setValidity('youtube-link', false);
            } else {
                ctrl.checkPageExists(ctrl.data.link);
            }
            ctrl.dataChanged();
        };

        ctrl.dataChanged = function (isMultipleSelect) {
            if (angular.isFunction(ctrl.eventDataChanged)) {
                //Bugfix of ng-select multiple. ng-change is called at init.
                if (!(isMultipleSelect && ctrl.isEditMode && angular.equals(ctrl.dataOnServer, ctrl.data) && !firstChangeSent)) {
                    firstChangeSent = true;
                    ctrl.eventDataChanged(!angular.equals(ctrl.dataOnServer, ctrl.data), ctrl.manageLinkPageForm.$valid);
                }
            }
        };

        ctrl.eventShowExistingOverview = function () {
            if (angular.isFunction(ctrl.eventShowExistingLinks)) {
                ctrl.eventShowExistingLinks(ctrl.searchResult);
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
