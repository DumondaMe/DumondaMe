'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ProblemReason', '$state',
            function (ProblemReason, $state) {
                var ctrl = this;

                ctrl.rateReason = function () {
                    if (!ctrl.element.ratedByUser) {
                        ProblemReason.save({positiveRate: {reasonId: ctrl.element.reasonId}}, function (resp) {
                            ctrl.element.ratedByUser = true;
                            ctrl.element.numberOfRatings = resp.numberOfRatings;
                            ctrl.sortRequest();
                        });
                    }
                };

                ctrl.removeRatingReason = function () {
                    if (ctrl.element.ratedByUser) {
                        ProblemReason.save({removePositiveRate: {reasonId: ctrl.element.reasonId}}, function (resp) {
                            ctrl.element.ratedByUser = false;
                            ctrl.element.numberOfRatings = resp.numberOfRatings;
                            ctrl.sortRequest();
                        });
                    }
                };

                ctrl.openReasonDetail = function () {
                    $state.go("problem.reason.detail", {reasonId: ctrl.element.reasonId});
                };
            }];
    }
};

