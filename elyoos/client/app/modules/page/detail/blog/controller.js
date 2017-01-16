'use strict';

module.exports = ['$mdDialog', 'Blog', 'errorToast', '$state',
    function ($mdDialog, Blog, errorToast, $state) {
        var ctrl = this;

        ctrl.deleteBlog = function () {
            var confirm = $mdDialog.confirm()
                .title("Blog löschen")
                .textContent("Willst Du diesen Blog wirklich löschen?")
                .ariaLabel("Delete Blog")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                ctrl.requestRunning = true;
                Blog.delete({
                    pageId: ctrl.blogDetail.page.pageId
                }, function () {
                    $state.go('home');
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Fehler beim Löschen des Blogs");
                });
            });
        };

    }];

