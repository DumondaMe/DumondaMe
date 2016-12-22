'use strict';

module.exports = ['dateFormatter', '$mdDialog', 'Blog', 'errorToast', 'PreviewTextService', 'UserDetailNavigation', 'BlogRecommendation',
    'PinwallHomeScrollService',
    function (dateFormatter, $mdDialog, Blog, errorToast, PreviewTextService, UserDetailNavigation, BlogRecommendation,
              PinwallHomeScrollService) {
        var ctrl = this;

        ctrl.requestRunning = false;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.previewText = PreviewTextService.getPreviewText(ctrl.element.text, 120).text;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };

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
                    pageId: ctrl.element.pageId
                }, function () {
                    ctrl.requestRunning = false;
                    PinwallHomeScrollService.removePinwallElement();
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Fehler beim Löschen des Blogs");
                });
            });
        };
    }];
