'use strict';

module.exports = ['$mdDialog', 'ForumQuestion', 'errorToast', function ($mdDialog, ForumQuestion, errorToast) {

    var lastCtrl = {};
    
    this.delete = function (question, questionId, ctrl) {
        lastCtrl = ctrl;
        var confirm = $mdDialog.confirm().title("Frage löschen")
            .textContent("Willst Du die Frage " + question + " wirklich löschen?")
            .ariaLabel("Delete Question")
            .ok("Löschen")
            .cancel("Abbrechen");
        return $mdDialog.show(confirm).then(function () {
            ctrl.requestRunning = true;
            return ForumQuestion.delete({questionId: questionId}).$promise;
        });
    };
    
    this.errorHandling = function (err) {
        if(err) {
            lastCtrl.requestRunning = false;
            errorToast.showError("Frage konnte nicht gelöscht werden");
        }
    };
}];
