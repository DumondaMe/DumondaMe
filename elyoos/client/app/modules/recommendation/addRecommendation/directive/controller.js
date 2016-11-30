'use strict';

module.exports = ['PageRecommendation', 'BlogRecommendation', 'errorToast', 'elyRequestFormatter',
    function (PageRecommendation, BlogRecommendation, errorToast, elyRequestFormatter) {
        var ctrl = this, service;

        ctrl.uploadRunning = false;
        if (ctrl.isBlog) {
            ctrl.isBlog = ctrl.isBlog === 'true';
        }
        if (ctrl.isBlog) {
            service = BlogRecommendation;
        } else {
            service = PageRecommendation;
        }

        ctrl.uploadRecommendation = function () {
            var data = {
                pageId: ctrl.pageId,
                comment: elyRequestFormatter.getOptionalString(ctrl.description)
            };
            ctrl.uploadRunning = true;
            service.save(data, function (resp) {
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
                ctrl.error = true;
                errorToast.showError('Empfehlung konnte nicht gespeichert werden!');
            });
        };
    }];

