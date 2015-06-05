'use strict';

var resetPages = function ($scope) {
    $scope.pagePreviews = [];
    $scope.expandSkipPages = 0;
    $scope.expand = false;
};

var setCategories = function (pages, PageCategories) {
    angular.forEach(pages, function (page) {
        page.category = PageCategories.categories[page.label];
    });
};

var containsPage = function (page, pagePreviews) {
    var exists = false;
    angular.forEach(pagePreviews, function (existingPage) {
        if (existingPage.pageId === page.pageId) {
            exists = true;
        }
    });
    return exists;
};

var addPagePreview = function ($scope) {
    angular.forEach($scope.pagePreviewsTemp.pages, function (page) {
        if (!containsPage(page, $scope.pagePreviews)) {
            $scope.pagePreviews.push(page);
        }
    });
};

var getPages = function ($scope, service, serviceParameter, PageCategories, limit, skip) {
    var params;
    if (service && serviceParameter) {
        params = {
            maxItems: limit,
            skip: skip
        };
        angular.extend(params, serviceParameter);
        $scope.pagePreviewsTemp = service.get(params, function () {
            setCategories($scope.pagePreviewsTemp.pages, PageCategories);
            addPagePreview($scope);
            $scope.totalNumberOfPages = $scope.pagePreviewsTemp.totalNumberOfPages;
            $scope.$emit('page.preview.request.finished', $scope.pagePreviews);
        });
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategories', function ($scope, PageCategories) {

            var init = true;
            $scope.notRequestInitService = $scope.notRequestInitService === 'true';
            resetPages($scope);

            $scope.$watch('service', function (newValue) {
                if (newValue && !$scope.hide && !$scope.notRequestInitService) {
                    getPages($scope, newValue, $scope.serviceParameter, PageCategories, 9, 0);
                }
            });

            $scope.$watchCollection('serviceParameter', function (newValue) {
                if (newValue) {
                    if (!init && !$scope.hide) {
                        resetPages($scope);
                        getPages($scope, $scope.service, newValue, PageCategories, 9, 0);
                    } else {
                        init = false;
                    }
                }
            });

            $scope.startExpand = function () {
                $scope.expandNumberOfPages = ($scope.numberOfElements * 2);
                $scope.expandSkipPages = 0;
                $scope.expand = true;
                getPages($scope, $scope.service, $scope.serviceParameter, PageCategories, $scope.expandNumberOfPages, $scope.expandSkipPages);
            };

            $scope.nextPages = function () {
                $scope.expandSkipPages += $scope.expandNumberOfPages;
                getPages($scope, $scope.service, $scope.serviceParameter, PageCategories, $scope.expandNumberOfPages, $scope.expandSkipPages);
            };
        }];
    }
};
