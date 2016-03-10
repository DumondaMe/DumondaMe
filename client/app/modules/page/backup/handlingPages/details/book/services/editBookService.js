'use strict';

module.exports = ['PageLoader', 'moment',
    function (PageLoader, moment) {
        var ctrl = this;
        var previousValues = {};

        ctrl.getPreviousValues = function () {
            return previousValues;
        };

        ctrl.getElementsToCompare = function () {
            return ['description', 'authors', 'publishDate', 'imagePreview', 'pageId'];
        };

        ctrl.getValues = function () {
            var pageDetail = PageLoader.getPageDetails(), values = {};
            values.description = pageDetail.description;
            values.authors = pageDetail.author[0].name;
            if (pageDetail.publishDate) {
                values.publishDate = moment.unix(pageDetail.publishDate).format('l');
            }
            values.imagePreview = pageDetail.titleUrl;
            values.pageId = pageDetail.pageId;
            previousValues = angular.copy(values);
            return values;
        };
    }];
