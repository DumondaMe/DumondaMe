'use strict';

module.exports = ['$mdDialog', 'ForumQuestionAnswer', 'errorToast', function ($mdDialog, ForumQuestionAnswer, errorToast) {

    var lastCtrl = {};
    
    this.delete = function (answer, answerId, ctrl) {
        lastCtrl = ctrl;
        var confirm = $mdDialog.confirm().title("Antwort löschen")
            .textContent("Willst Du die Antwort " + answer + " wirklich löschen?")
            .ariaLabel("Delete Question")
            .ok("Löschen")
            .cancel("Abbrechen");
        return $mdDialog.show(confirm).then(function () {
            ctrl.requestRunning = true;
            return ForumQuestionAnswer.delete({answerId: answerId}).$promise;
        });
    };
    
    this.errorHandling = function (err) {
        if(err) {
            lastCtrl.requestRunning = false;
            errorToast.showError("Antwort konnte nicht gelöscht werden");
        }
    };
}];
