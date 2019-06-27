'use strict';

module.exports = ['$scope', 'FileReaderUtil', 'FileReader', 'CheckPageExists', 'Topics', 'Languages',
    'PageYoutubeLink',
    function ($scope, FileReaderUtil, FileReader, CheckPageExists, Topics, Languages, PageYoutubeLink) {
        var ctrl = this, firstChangeSent = false;

        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;
        ctrl.dataOnServer = angular.copy(ctrl.data);
        CheckPageExists.reset();

        ctrl.titleLostFocus = function () {
            ctrl.checkPageExists();
        };

        ctrl.titleHasChanged = function () {
            if (ctrl.data.title && ctrl.data.title.length > 10) {
                ctrl.checkPageExists(ctrl.data.title);
            }
            ctrl.dataChanged();
        };

        ctrl.linkHasChanged = function () {
            var validLink = PageYoutubeLink.isValidYoutubeLink(ctrl.data.link);
            ctrl.manageYoutubePageForm.link.$setValidity('ely-invalid-link', validLink);

            if (validLink) {
                ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
                ctrl.youtubeLinkFormatted = PageYoutubeLink.getYoutubeLink(ctrl.data.link);
                ctrl.checkPageExists(ctrl.youtubeLinkFormatted);
            }
            ctrl.dataChanged();
        };

        ctrl.checkPageExists = function (query) {
            return CheckPageExists.checkPageExists(query, 'Youtube').then(function (result) {
                ctrl.searchResult = result.searchResult;
                ctrl.pageExists = result.pageExists;
            });
        };

        ctrl.dataChanged = function (isMultipleSelect) {
            if (angular.isFunction(ctrl.eventDataChanged)) {
                //Bugfix of ng-select multiple. ng-change is called at init.
                if (!(isMultipleSelect && ctrl.isEditMode && angular.equals(ctrl.dataOnServer, ctrl.data) && !firstChangeSent)) {
                    firstChangeSent = true;
                    ctrl.eventDataChanged(!angular.equals(ctrl.dataOnServer, ctrl.data), ctrl.manageYoutubePageForm.$valid);
                }
            }
        };

        ctrl.eventShowExistingOverview = function () {
            if (angular.isFunction(ctrl.eventShowExistingBooks)) {
                ctrl.eventShowExistingBooks(ctrl.searchResult);
            }
        };
    }];
