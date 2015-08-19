'use strict';

module.exports = ['$scope', '$rootScope', '$window', '$timeout', 'dateFormatter', 'PromiseModal', 'Blog', 'WaitingScreen', 'UrlCache',
    function ($scope, $rootScope, $window, $timeout, dateFormatter, PromiseModal, Blog, WaitingScreen, UrlCache) {

        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;
        $scope.cacheUrl = UrlCache.cacheUrl;

        $scope.removeBlog = function (blogId) {
            PromiseModal.getModal({
                title: 'Blog l\u00f6schen',
                content: 'Willst Du diesen Blog wirklich l\u00f6schen?',
                templateUrl: 'app/modules/util/dialog/yesNoDialog.html',
                placement: 'center'
            }).show().then(function () {
                var finished = WaitingScreen.openScreen('Blog wird gel\u00f6scht...');
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

