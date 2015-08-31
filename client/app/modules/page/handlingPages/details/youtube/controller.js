'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$stateParams', 'PageYoutubeLink', 'UploadYoutubePage',
            function ($scope, $stateParams, PageYoutubeLink, UploadYoutubePage) {
                var ctrl = this;

                ctrl.youtubeLinkChanged = function () {
                    $scope.commonForm.inputYoutubeLink.$setValidity('custom', PageYoutubeLink.isValidYoutubeLink(ctrl.youtubeLink));
                    ctrl.youtubeLinkFormatted = PageYoutubeLink.getYoutubeLink(ctrl.youtubeLink);
                };

                ctrl.uploadPage = function () {
                    UploadYoutubePage.uploadPage(ctrl.description, ctrl.youtubeLinkFormatted, $stateParams.pageId);
                };
            }];
    }
};
