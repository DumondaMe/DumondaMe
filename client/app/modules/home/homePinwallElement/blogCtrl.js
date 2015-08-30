'use strict';

module.exports = ['$scope', '$rootScope', '$window', '$timeout', 'dateFormatter', 'ElyModal', 'Blog', 'WaitingScreen', 'UrlCache',
    function ($scope, $rootScope, $window, $timeout, dateFormatter, ElyModal, Blog, WaitingScreen, UrlCache) {

        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
        $scope.cacheUrl = UrlCache.cacheUrl;

        $scope.removeBlog = function (blogId) {
            ElyModal.show()({
                scope: {
                    title: 'Blog löschen',
                    content: 'Willst Du diesen Blog wirklich löschen?'
                },
                templateUrl: 'app/modules/util/dialog/yesNoDialog.html',
                size: 'sm'
            }).then(function () {
                var finished = WaitingScreen.openScreen('Blog wird gelöscht...');
                Blog.delete({
                    blogId: blogId
                }, function () {
                    $scope.elementRemoved($scope.element);
                    finished();
                }, function () {
                    finished();
                });
            });
        };

        $scope.openFullScreenDetail = function () {
            $rootScope.fullScreen.data = $scope.element;
            $rootScope.fullScreen.scrollY = $window.scrollY;
            $rootScope.fullScreen.template = 'app/modules/home/homePinwallElement/blogDetail/blogDetail.html';
            $rootScope.fullScreen.show = true;
        };
    }];

