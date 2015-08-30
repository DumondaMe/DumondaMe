'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'Languages', 'PageCategories', 'ElyModal', 'UrlCache',
            function ($scope, $state, Languages, PageCategories, ElyModal, UrlCache) {

                $scope.cacheUrl = UrlCache.cacheUrl;

                $scope.$watchCollection('pagePreview', function (newValue) {
                    if (newValue) {
                        $scope.pagePreview.languageShow = Languages.getLanguage($scope.pagePreview.language);
                        $scope.pagePreview.labelShow = PageCategories.categories[$scope.pagePreview.label].description;
                    }
                });

                $scope.openDetail = function (pageId, label) {
                    $state.go('page.detail', {
                        label: label,
                        pageId: pageId
                    });
                };

                $scope.showComment = function (contact) {
                    if (contact && contact.hasOwnProperty('comment') && contact.comment.trim() !== "" && contact.hasOwnProperty('url')) {
                        ElyModal.show({
                            scope: {contact: contact},
                            title: 'Kommentar zu ' + $scope.pagePreview.title,
                            templateUrl: 'app/modules/page/pagePreview/commentDialog.html'
                        });
                    }
                };
            }];
    }
};
