'use strict';

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
        });
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategories', function ($scope, PageCategories) {

            var init = true;
            $scope.pagePreviews = [];

            $scope.$watch('service', function (newValue) {
                if (newValue && !$scope.hide) {
                    getPages($scope, newValue, $scope.serviceParameter, PageCategories, 9, 0);
                }
            });

            $scope.$watchCollection('serviceParameter', function (newValue) {
                if (newValue) {
                    if (!init && !$scope.hide) {
                        $scope.pagePreviews = [];
                        getPages($scope, $scope.service, newValue, PageCategories, 9, 0);
                    } else {
                        init = false;
                    }
                }
            });

            $scope.startExpand = function () {
                var limit = ($scope.numberOfElements * 2);
                $scope.expand = true;
                getPages($scope, $scope.service, $scope.serviceParameter, PageCategories, limit, 0);
            };
        }];
    }
};
