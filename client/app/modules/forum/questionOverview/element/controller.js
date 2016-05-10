'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$state',
            function ($state) {
                var ctrl = this;

                ctrl.openDetail = function (problemId) {
                    $state.go('problem.detail', {
                        problemId: problemId
                    });
                };
            }];
    }
};

