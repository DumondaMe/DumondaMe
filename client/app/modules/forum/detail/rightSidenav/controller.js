'use strict';

module.exports = ['$mdSidenav', '$stateParams', 'ElyModal', 'ForumQuestionDetailCollection',
    function ($mdSidenav, $stateParams, ElyModal, ForumQuestionDetailCollection) {
        var ctrl = this;

        ctrl.addExplanation = function () {
            $mdSidenav('rightQuestionNav').close();
            ElyModal.show('ForumAddAnswerCtrl', 'app/modules/forum/modal/addAnswer/template.html',
                {questionId: $stateParams.questionId, isExplanation: true})
                .then(function (resp) {
                    ForumQuestionDetailCollection.addExplanation(resp);
                });
        };

        ctrl.addSolution= function () {
            $mdSidenav('rightQuestionNav').close();
            ElyModal.show('ForumAddAnswerCtrl', 'app/modules/forum/modal/addAnswer/template.html',
                {questionId: $stateParams.questionId, isSolution: true})
                .then(function (resp) {
                    ForumQuestionDetailCollection.addSolution(resp);
                });
        };
    }];

