'use strict';

var getScrollElement = function ($document, id) {
    var queryResult = $document[0].querySelector('.ely-popular-column-inner-container' + id);
    return angular.element(queryResult);
};

var heightPreview = 82;

module.exports = ['PopularRecommendation', '$document', 'ScrollRequest', 'PopularRecommendationScrollRequestResponseHandler',
    'PopularPageRecommendationFilters',
    function (PopularRecommendation, $document, ScrollRequest, PopularRecommendationScrollRequestResponseHandler, PopularPageRecommendationFilters) {
        var ctrl = this, filters = PopularPageRecommendationFilters.getFilterParams();
        ctrl.scrollTop = 0;
        ctrl.totalScrollHeight = 0;
        ctrl.scrollHeight = 0;
        ctrl.preview = {recommendations: []};
        ctrl.requestRunning = true;

        PopularPageRecommendationFilters.registerColumn(ctrl.id, this);
        ScrollRequest.reset('popularRecommendations' + ctrl.id, PopularRecommendation.get, PopularRecommendationScrollRequestResponseHandler);

        ctrl.nextRecommendationServer = function () {
            filters.period = ctrl.period;
            ctrl.noRecommendationPreview = false;
            ScrollRequest.nextRequest('popularRecommendations' + ctrl.id, ctrl.preview.recommendations, filters).then(function (preview) {
                ctrl.requestRunning = false;
                ctrl.preview = preview;
                ctrl.totalScrollHeight = ctrl.preview.recommendations.length * heightPreview;
                if(ctrl.preview.recommendations.length === 0) {
                    ctrl.noRecommendationPreview = true;
                }
            });
        };

        ctrl.nextRecommendationServer();

        ctrl.getHeightColumn = function (height) {
            ctrl.scrollHeight = height;
        };

        ctrl.setScrollPosition = function (scrollTop, height) {
            ctrl.scrollTop = scrollTop;
            ctrl.totalScrollHeight = height;
        };

        ctrl.nextRecommendations = function () {
            getScrollElement($document, ctrl.id).duScrollTo(0, ctrl.scrollTop + ctrl.scrollHeight, 400);
        };

        ctrl.previousRecommendations = function () {
            getScrollElement($document, ctrl.id).duScrollTo(0, ctrl.scrollTop - ctrl.scrollHeight, 400);
        };

        ctrl.filterChanged = function (newFilters) {
            ScrollRequest.reset('popularRecommendations' + ctrl.id, PopularRecommendation.get, PopularRecommendationScrollRequestResponseHandler);
            filters = newFilters;
            ctrl.preview = {recommendations: []};
            ctrl.requestRunning = true;
            ctrl.totalScrollHeight = 0;
            getScrollElement($document, ctrl.id).scrollTop(0);
            ctrl.nextRecommendationServer();
        };
    }];
