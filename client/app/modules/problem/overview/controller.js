'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'Problem', 'ProblemScrollRequestResponseHandler',
            function (ScrollRequest, Problem, ProblemScrollRequestResponseHandler) {
                var ctrl = this;
                ctrl.overview = {problems: []};

                ScrollRequest.reset('Problem', Problem.get, ProblemScrollRequestResponseHandler);

                ctrl.nextOverview = function () {
                    ScrollRequest.nextRequest('Problem', ctrl.overview.problems).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };

                ctrl.nextOverview();
            }];
    }
};

