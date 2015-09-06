'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageEditModeService', 'PageYoutubeLink', 'UploadYoutubePage', 'EditYoutubeService',
            function ($scope, PageEditModeService, PageYoutubeLink, UploadYoutubePage, EditYoutubeService) {
                var ctrl = this;

                ctrl.isEditMode = PageEditModeService.isEditMode();

                ctrl.youtubeLinkChanged = function () {
                    ctrl.descriptionChanged();
                    $scope.commonForm.inputYoutubeLink.$setValidity('custom', PageYoutubeLink.isValidYoutubeLink(ctrl.youtubeLink));
                    ctrl.youtubeLinkFormatted = PageYoutubeLink.getYoutubeLink(ctrl.youtubeLink);
                };

                ctrl.descriptionChanged = function () {
                    ctrl.editDataChanged = PageEditModeService.hasChanged(ctrl, EditYoutubeService.getPreviousValues(),
                        EditYoutubeService.getElementsToCompare());
                };

                ctrl.uploadPage = function () {
                    UploadYoutubePage.uploadPage(ctrl.description, ctrl.youtubeLinkFormatted, ctrl.pageId);
                };

                if (ctrl.isEditMode) {
                    angular.merge(ctrl, EditYoutubeService.getValues());
                }
            }];
    }
};
