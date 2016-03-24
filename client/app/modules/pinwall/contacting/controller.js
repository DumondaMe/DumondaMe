'use strict';

module.exports = ['$state', function ($state) {
    var ctrl = this;
    
    ctrl.goToContacting = function () {
        $state.go('contact.overview', {showContacting: true});
    };
}];

