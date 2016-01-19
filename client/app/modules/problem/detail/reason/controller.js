'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'ScrollRequest', 'ProblemReason', 'ScrollProblemReasonService', '$mdDialog',
            function ($stateParams, ScrollRequest, ProblemReason, ScrollProblemReasonService, $mdDialog) {
                var ctrl = this;
                ctrl.overview = {reasons: []};

                ScrollRequest.reset('ProblemReasons', ProblemReason.get, ScrollProblemReasonService);

                ctrl.nextReasons = function () {
                    ScrollRequest.nextRequest('ProblemReasons', ctrl.overview.reasons, {problemId: $stateParams.problemId})
                        .then(function (overview) {
                            ctrl.overview = overview;
                        });
                };

                ctrl.nextReasons();

                ctrl.createReason = function () {
                    $mdDialog.show({
                        templateUrl: 'app/modules/problem/detail/reason/create/template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        controller: 'CreateReasonController',
                        bindToController: true,
                        controllerAs: 'ctrl'
                    }).then(function (resp) {

                    });
                };
            }];
    }
};

