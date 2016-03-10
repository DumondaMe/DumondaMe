'use strict';

var minScreenSize = 1000;
var maxScreenSize = 1900;

var setContainerWidth = function (ctrl, $scope) {
    var containerSize, screenWidth = $(window).width();
    if (ctrl.containerMaxWidth) {
        ctrl.numberOfElements = Math.floor(ctrl.containerMaxWidth / 190);
    } else if (screenWidth > minScreenSize && screenWidth <= maxScreenSize) {
        containerSize = screenWidth - 270;
        ctrl.numberOfElements = Math.floor(containerSize / 190);
    } else if (screenWidth < minScreenSize) {
        ctrl.numberOfElements = 4;
    } else if (screenWidth > maxScreenSize) {
        ctrl.numberOfElements = 8;
    }

    ctrl.containerWidth = 190 * ctrl.numberOfElements;
    $scope.$applyAsync();
};

var resetPages = function (ctrl) {
    ctrl.pagePreviews = [];
    ctrl.expandSkipPages = 0;
    ctrl.expand = false;
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

var addPagePreview = function (ctrl) {
    angular.forEach(ctrl.pagePreviewsTemp.pages, function (page) {
        if (!containsPage(page, ctrl.pagePreviews)) {
            ctrl.pagePreviews.push(page);
        }
    });
};

var getPages = function (ctrl, service, serviceParameter, PageCategories, limit, skip) {
    var params;
    if (service && serviceParameter) {
        params = {
            maxItems: limit,
            skip: skip
        };
        angular.extend(params, serviceParameter);
        ctrl.pagePreviewsTemp = service.get(params, function () {
            setCategories(ctrl.pagePreviewsTemp.pages, PageCategories);
            addPagePreview(ctrl);
            ctrl.totalNumberOfPages = ctrl.pagePreviewsTemp.totalNumberOfPages;
            if (ctrl.pageRequestStart.hasOwnProperty('requestFinished')) {
                ctrl.pageRequestStart.requestFinished(ctrl.pagePreviews);
            }
        });
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageCategories', function ($scope, PageCategories) {
            var serviceParameter = {}, ctrl = this;
            resetPages(ctrl);

            if (!ctrl.containerMaxWidth) {
                $(window).resize(function () {
                    setContainerWidth(ctrl, $scope);
                });
            }

            setContainerWidth(ctrl, $scope);

            ctrl.pageRequestStart.startRequested = function (params) {
                serviceParameter = params;
                resetPages(ctrl);
                getPages(ctrl, ctrl.service, params, PageCategories, 9, 0);
            };

            if (ctrl.pageRequestStart.hasOwnProperty('initParams')) {
                ctrl.pageRequestStart.startRequested(ctrl.pageRequestStart.initParams);
            }

            ctrl.startExpand = function () {
                ctrl.expandNumberOfPages = (ctrl.numberOfElements * 2);
                ctrl.expandSkipPages = 0;
                ctrl.expand = true;
                getPages(ctrl, ctrl.service, serviceParameter, PageCategories, ctrl.expandNumberOfPages, ctrl.expandSkipPages);
            };

            ctrl.nextPages = function () {
                ctrl.expandSkipPages += ctrl.expandNumberOfPages;
                getPages(ctrl, ctrl.service, serviceParameter, PageCategories, ctrl.expandNumberOfPages, ctrl.expandSkipPages);
            };
        }];
    }
};
