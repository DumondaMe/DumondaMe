'use strict';

var initRating = function (ctrl) {
    var i;
    ctrl.rating = [];
    for (i = 0; i < 5; i++) {
        ctrl.rating.push({numberOfRatings: 0, rating: 0, width: 1});
    }
};

var setCreateDate = function (reviews, moment) {
    angular.forEach(reviews, function (review) {
        review.created = moment.unix(review.created).format('LL');
    });
};

module.exports = ['PageDetailReview', '$stateParams', 'moment', 'PageRatingOverviewCalcService',
    function (PageDetailReview, $stateParams, moment, PageRatingOverviewCalcService) {
        var ctrl = this;

        if (angular.isObject(ctrl.commands)) {
            ctrl.commands.reload = function () {
                ctrl.getPageDetailReview();
            };
        }

        ctrl.getPageDetailReview = function () {
            ctrl.review = PageDetailReview.get({
                skip: 0,
                maxItems: 2,
                onlyContacts: ctrl.onlyContact,
                pageId: $stateParams.pageId,
                label: $stateParams.label
            }, function () {
                initRating(ctrl);
                PageRatingOverviewCalcService.calculateSummaryRating(ctrl);
                PageRatingOverviewCalcService.calculateDiagramBlockWidth(ctrl);
                setCreateDate(ctrl.review.reviews, moment);
            });
        };
        ctrl.getPageDetailReview();
    }];

