'use strict';

module.exports = ['ForumAnswerRate',
    function (ForumAnswerRate) {
        var ctrl = this;

        ctrl.ratePositive = function () {
            ForumAnswerRate.save({answerId: ctrl.answer.answerId}, function () {
                ctrl.answer.ratedByUser = true;
                ctrl.answer.positiveRating++;
            });
        };

        ctrl.deleteRating = function () {
            ForumAnswerRate.delete({answerId: ctrl.answer.answerId}, function () {
                delete ctrl.answer.ratedByUser;
                ctrl.answer.positiveRating--;
            });
        };
    }];

