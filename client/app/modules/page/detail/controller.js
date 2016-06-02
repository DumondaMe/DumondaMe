'use strict';

module.exports = ['PageDetail', '$stateParams', 'moment',
    function (PageDetail, $stateParams, moment) {
        var ctrl = this;

        ctrl.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
            if (ctrl.pageDetail.recommendation && ctrl.pageDetail.recommendation.user) {
                ctrl.pageDetail.recommendation.user.created = moment.unix(ctrl.pageDetail.recommendation.user.created).format('LL');
            }
        });

        ctrl.label = $stateParams.label;
    }];

