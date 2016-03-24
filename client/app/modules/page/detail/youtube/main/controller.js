'use strict';

module.exports = ['Categories', 'ElyModal', '$mdDialog', 'UserPage', 'errorToast', '$state',
    function (Categories, ElyModal, $mdDialog, UserPage, errorToast, $state) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        selectedCategories: ctrl.pageDetail.page.category
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.category = Categories.getCodes(data.selectedCategories);
            });
        };

        ctrl.deletePage = function () {
            var confirm = $mdDialog.confirm()
                .title("Seite löschen")
                .textContent("Willst Du diese Seite wirklich löschen?")
                .ariaLabel("Delete Page")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                ctrl.deleteRequestRunning = true;
                UserPage.delete({
                    pageId: ctrl.pageDetail.page.pageId
                }, function () {
                    $state.go('home');
                }, function () {
                    ctrl.deleteRequestRunning = false;
                    errorToast.showError("Die Seite konnte nicht gelöscht werden");
                });
            });
        };
    }];

