'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ProblemReasonDetail', '$state',
            function ($stateParams, ProblemReasonDetail, $state) {
                var ctrl = this;

                ctrl.detail = ProblemReasonDetail.get({reasonId: $stateParams.reasonId});

                ctrl.edit = function () {

                };

                ctrl.goToProblem = function () {
                    $state.go("problem.detail", {problemId: ctrl.detail.reason.problem.problemId});
                };
            }];
    }
};

