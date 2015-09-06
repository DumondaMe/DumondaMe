'use strict';

module.exports = ['PageLoader',
    function (PageLoader) {
        var ctrl = this;
        var previousValues = {};

        ctrl.getPreviousValues = function () {
            return previousValues;
        };

        ctrl.getElementsToCompare = function () {
            return ['youtubeLinkFormatted', 'description', 'pageId'];
        };

        ctrl.getValues = function () {
            var pageDetail = PageLoader.getPageDetails(), values = {};
            values.youtubeLink = pageDetail.link;
            values.youtubeLinkFormatted = pageDetail.link;
            values.description = pageDetail.description;
            values.pageId = pageDetail.pageId;
            previousValues = angular.copy(values);
            return values;
        };
    }];
