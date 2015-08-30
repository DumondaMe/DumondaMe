'use strict';

module.exports = ['$modalInstance', 'PageRecommendation', 'pageId', function ($modalInstance, PageRecommendation, pageId) {
    var ctrl = this;

    ctrl.numberOfSelectedStars = -1;

    ctrl.abort = function () {
        $modalInstance.dismiss();
    };

    ctrl.addRecommendation = function () {
        var data = {
            pageId: pageId,
            comment: ctrl.recommendationDescription,
            rating: ctrl.numberOfSelectedStars
        };

        delete ctrl.error;
        PageRecommendation.save(data, function (res) {
            data.profileUrl = res.profileUrl;
            data.recommendationId = res.recommendationId;
            data.recommendation = res.recommendation;
            data.created = res.created;
            $modalInstance.close(data);
        }, function () {
            ctrl.error = 'Bewertung konnte nicht gespeichert werden';
        });
    };
}];
