'use strict';

module.exports = ['PopularRecommendation', '$document',
    function (PopularRecommendation, $document) {
        var ctrl = this;
        ctrl.scrollPosition = 0;
        ctrl.maxScrollPos = 2000;
        ctrl.scrollHeight = 0;
        
        ctrl.preview = PopularRecommendation.get({skip: 0, maxItems: 25, onlyContact: false, period: 'all'});

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
