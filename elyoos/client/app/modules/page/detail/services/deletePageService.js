'use strict';

module.exports = ['$mdDialog', 'UserPage', '$state', 'errorToast',
    function ($mdDialog, UserPage, $state, errorToast) {

        this.deletePage = function (pageId) {
            var confirm = $mdDialog.confirm()
                .title("Buch Seite löschen")
                .textContent("Willst Du diese Seite wirklich löschen?")
                .ariaLabel("Delete Book Page")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                UserPage.delete({
                    pageId: pageId
                }, function () {
                    $state.go('home');
                }, function () {
                    errorToast.showError("Fehler beim Löschen der Bewertung");
                });
            });
        };

    }];
