'use strict';

module.exports = ['PageRecommendation', 'errorToast',
    function (PageRecommendation, errorToast) {
        var ctrl = this;

        ctrl.numberOfSelectedStars = -1;

        ctrl.uploadRecommendation = function () {
            var data = {
                pageId: ctrl.pageId,
                comment: ctrl.description,
                rating: ctrl.numberOfSelectedStars
            };

            PageRecommendation.save(data, function (res) {
                data.profileUrl = res.profileUrl;
                data.recommendationId = res.recommendationId;
                data.recommendation = res.recommendation;
                data.created = res.created;
                ctrl.finish(data);
            }, function () {
                errorToast.showError('Bewertung konnte nicht gespeichert werden!');
            });
        };
    }];

