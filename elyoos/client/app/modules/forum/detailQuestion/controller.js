'use strict';

module.exports = ['$scope', '$stateParams', '$mdMedia', 'ForumQuestionDetail', 'ForumQuestionDetailCollection', 'ElyModal',
    function ($scope, $stateParams, $mdMedia, ForumQuestionDetail, ForumQuestionDetailCollection, ElyModal) {
        var ctrl = this;
        ctrl.$mdMedia = $mdMedia;

        ctrl.detail = ForumQuestionDetail.get({questionId: $stateParams.questionId}, function () {
            ForumQuestionDetailCollection.set(ctrl.detail);
        });

        ctrl.createAnswer = function () {
            ElyModal.show('CreateForumAnswerController', 'app/modules/forum/modal/createAnswer/template.html',
                {questionId: $stateParams.questionId});
        };

        ctrl.removedSolution = function (index) {
            ctrl.detail.solution.splice(index, 1);
        };

        ctrl.removedExplanation = function (index) {
            ctrl.detail.explanation.splice(index, 1);
        };
    }];
