'use strict';

module.exports = [function () {

    this.calculateSummaryRating = function (ctrl) {
        ctrl.totalNumberOfRatings = 0;
        ctrl.summaryRating = 0;
        angular.forEach(ctrl.review.ratings, function (rating) {
            ctrl.totalNumberOfRatings += rating.numberOfRatings;
            ctrl.summaryRating += (rating.rating * rating.numberOfRatings);
            ctrl.rating[rating.rating - 1] = rating;
            ctrl.rating[rating.rating - 1].width = 1;
        });
        if (ctrl.summaryRating > 0) {
            ctrl.summaryRating = Math.round((ctrl.summaryRating / ctrl.totalNumberOfRatings) * 10) / 10;
        } else {
            ctrl.summaryRating = 0;
        }
    };

    this.calculateDiagramBlockWidth = function (ctrl) {
        var i;
        ctrl.review.ratings.sort(function (a, b) {
            return b.numberOfRatings - a.numberOfRatings;
        });
        for (i = 0; i < ctrl.review.ratings.length; i++) {
            if (i === 0) {
                ctrl.rating[ctrl.review.ratings[0].rating - 1].width = 100;
            } else {
                ctrl.rating[ctrl.review.ratings[i].rating - 1].width =
                    (ctrl.review.ratings[i].numberOfRatings / ctrl.review.ratings[0].numberOfRatings ) * 100;
            }
        }

    };
}];
