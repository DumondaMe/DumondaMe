'use strict';

module.exports = ['PopularRecommendation', '$document', 'ScrollRequest', 'PopularRecommendationScrollRequestResponseHandler',
    function (PopularRecommendation, $document, ScrollRequest, PopularRecommendationScrollRequestResponseHandler) {
        var ctrl = this;
        ctrl.scrollPosition = 0;
        ctrl.maxScrollPos = 2000;
        ctrl.scrollHeight = 0;
        ctrl.preview = {recommendations: []};

        ScrollRequest.reset('popularRecommendations', PopularRecommendation.get, PopularRecommendationScrollRequestResponseHandler);

        ctrl.nextRecommendationServer = function () {
            ScrollRequest.nextRequest('popularRecommendations', ctrl.preview.recommendations,
                {onlyContact: false, period: 'all'}).then(function (preview) {
                ctrl.preview = preview;
            });
        };

        ctrl.nextRecommendationServer();

        ctrl.getHeightColumn = function (height) {
            ctrl.scrollHeight = height;
        };

        ctrl.setScrollPosition = function (newScrollPosition, maxScrollPos) {
            ctrl.scrollPosition = newScrollPosition;
            ctrl.maxScrollPos = maxScrollPos - ctrl.scrollHeight;
        };

        ctrl.nextRecommendations = function () {
            var queryResult = $document[0].querySelector('.ely-popular-column-inner-container');
            angular.element(queryResult).duScrollTo(0, ctrl.scrollPosition + ctrl.scrollHeight, 400);
        };

        ctrl.previousRecommendations = function () {
            var queryResult = $document[0].querySelector('.ely-popular-column-inner-container');
            angular.element(queryResult).duScrollTo(0, ctrl.scrollPosition - ctrl.scrollHeight, 400);
        };
    }];
