'use strict';

module.exports = ['PageRecommendation', 'errorToast', 'elyRequestFormatter',
    function (PageRecommendation, errorToast, elyRequestFormatter) {
        var ctrl = this;

        ctrl.numberOfSelectedStars = -1;
        ctrl.uploadRunning = false;

        ctrl.uploadRecommendation = function () {
            var data = {
                pageId: ctrl.pageId,
                comment: elyRequestFormatter.getOptionalString(ctrl.description),
                rating: ctrl.numberOfSelectedStars
            };
            ctrl.uploadRunning = true;
            PageRecommendation.save(data, function (resp) {
                var recommendation = {
                    recommendation: {
                        summary: resp.recommendation,
                        user: {
                            rating: ctrl.numberOfSelectedStars,
                            comment: ctrl.description,
                            recommendationId: resp.recommendationId,
                            created: resp.created
                        }
                    }
                };
                ctrl.finish(recommendation);
            }, function () {
                ctrl.uploadRunning = false;
                errorToast.showError('Bewertung konnte nicht gespeichert werden!');
            });
        };
    }];

