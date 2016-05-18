'use strict';

module.exports = ['$state', 'countFormatter', 'Categories', 'ForumQuestion', 'errorToast', '$mdDialog',
    function ($state, countFormatter, Categories, ForumQuestion, errorToast, $mdDialog) {
        var ctrl = this;

        ctrl.element.activityRating = countFormatter.getCount(ctrl.element.activityRating);

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;
        
        ctrl.deleteQuestion = function (questionId) {

            var confirm = $mdDialog.confirm().title("Frage löschen")
                .textContent("Willst Du die Frage " + ctrl.element.description + " wirklich löschen?")
                .ariaLabel("Delete Question")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                ctrl.requestRunning = true;
                ForumQuestion.delete({questionId: questionId}, function (){
                    ctrl.removeQuestion(ctrl.index);
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Frage konnte nicht gelöscht werden");
                });
            });
        };

        ctrl.openDetail = function (questionId) {
            $state.go('forum.question.detail', {
                questionId: questionId
            });
        };
    }];

