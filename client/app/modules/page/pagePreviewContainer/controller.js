'use strict';

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
            ctrl.pageRequestStart.requestFinished(ctrl.pagePreviews);
        });
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['PageCategories', function (PageCategories) {

            //var init = true;
            var serviceParameter = {}, ctrl = this;
            this.notRequestInitService = this.notRequestInitService === 'true';
            resetPages(this);

            this.pageRequestStart.startRequested = function (params) {
                serviceParameter = params;
                resetPages(ctrl);
                getPages(ctrl, ctrl.service, params, PageCategories, 9, 0);
            };

            /*$scope.$watch('service', function (newValue) {
             if (newValue && !$scope.hide && !$scope.notRequestInitService) {
             getPages($scope, newValue, $scope.serviceParameter, PageCategories, 9, 0);
             }
             });*/

            /*$scope.$watchCollection('serviceParameter', function (newValue) {
             if (newValue) {
             if (!init && !$scope.hide) {
             resetPages($scope);
             getPages($scope, $scope.service, newValue, PageCategories, 9, 0);
             } else {
             init = false;
             }
             }
             });*/

            this.startExpand = function () {
                this.expandNumberOfPages = (this.numberOfElements * 2);
                this.expandSkipPages = 0;
                this.expand = true;
                getPages(this, this.service, serviceParameter, PageCategories, this.expandNumberOfPages, this.expandSkipPages);
            };

            this.nextPages = function () {
                this.expandSkipPages += this.expandNumberOfPages;
                getPages(this, this.service, serviceParameter, PageCategories, this.expandNumberOfPages, this.expandSkipPages);
            };
        }];
    }
};
