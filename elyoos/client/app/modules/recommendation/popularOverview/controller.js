'use strict';

module.exports = ['$mdMedia', '$mdSidenav', function ($mdMedia, $mdSidenav) {
    var ctrl = this;

    ctrl.$mdMedia = $mdMedia;

    ctrl.openSideNavRight = function () {
        $mdSidenav('rightFilterRecommendationNav').open();
    };
}];
