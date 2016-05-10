'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ProblemDetail',
            function ($stateParams, ProblemDetail) {
                var ctrl = this;
                ctrl.detail = ProblemDetail.get({id: $stateParams.problemId}, function (resp) {

                });
            }];
    }
};

