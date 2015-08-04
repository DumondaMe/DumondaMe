'use strict';

module.exports = {
    directiveLink: function ($animate, $timeout) {
        return function ($scope, element) {

            $scope.$watch('showExpand', function (newValue) {
                if (newValue) {
                    element.addClass('ng-hide');
                }
            });

            $scope.$watch('isExpand', function (newValue) {
                if ($scope.showExpand === false) {
                    if (newValue) {
                        element.addClass('ng-hide');
                    } else {
                        element.removeClass('ng-hide');
                    }
                } else {
                    if (newValue) {
                        element.removeClass('ng-hide');
                        $animate.addClass(element, 'is-extended');
                    }
                }
            });

            $scope.abort = function () {
                if ($scope.showExpand) {
                    $animate.removeClass(element, 'is-extended').then(function () {
                        $animate.addClass(element, 'ng-hide');
                        $scope.isExpand = false;
                        $scope.$broadcast('home.blog.abort');
                    });
                }
            };

            $scope.expandBlog = function () {
                if (!$scope.showExpand) {
                    $scope.isExpand = true;
                }
            };

            $scope.attachPhoto = function () {
                $timeout(function () {
                    element.find('.select-file-dialog').trigger('click');
                }, 0, false);
            };
        };
    }
};
