'use strict';

module.exports = ['$mdDialog', 'UserPage', '$state', 'errorToast',
    function ($mdDialog, UserPage, $state, errorToast) {

        this.deletePage = function (pageId) {
            var confirm = $mdDialog.confirm()
                .title("Beitrag löschen")
                .textContent("Willst Du diesen Beitrag wirklich löschen?")
                .ariaLabel("Delete Page")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                UserPage.delete({
                    pageId: pageId
                }, function () {
                    $state.go('home');
                }, function () {
                    errorToast.showError("Fehler beim Löschen des Beitrages");
                });
            });
        };

    }];
