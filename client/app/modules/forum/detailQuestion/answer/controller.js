'use strict';

module.exports = ['$state',
    function ($state) {
        var ctrl = this;

        ctrl.openAnswerDetail = function () {
            $state.go('forum.answer.detail', {answerId: ctrl.answer.answerId});
        };
    }];

