'use strict';

module.exports = ['Categories', 'ElyModal', '$mdDialog', 'UserPage', 'errorToast', '$state',
    function (Categories, ElyModal, $mdDialog, UserPage, errorToast, $state) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.modifyPage = function () {
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html',
                {
                    data: {
                        pageId: ctrl.pageDetail.page.pageId,
                        title: ctrl.pageDetail.page.title,
                        description: ctrl.pageDetail.page.description,
                        author: ctrl.pageDetail.page.author[0].name,
                        publishDate: ctrl.pageDetail.page.publishDate,
                        selectedCategories: ctrl.pageDetail.page.category,
                        dataUri: ctrl.pageDetail.page.titleUrl
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.pageDetail.page.description = data.description;
                ctrl.pageDetail.page.author[0].name = data.author;
                ctrl.pageDetail.page.publishDate = data.publishDate;
                ctrl.pageDetail.page.category = Categories.getCodes(data.selectedCategories);
                ctrl.pageDetail.page.titleUrl = data.dataUri;
            });
        };

        ctrl.deletePage = function () {
            var confirm = $mdDialog.confirm()
                .title("Buch Seite löschen")
                .textContent("Willst Du diese Seite wirklich löschen?")
                .ariaLabel("Delete Book Page")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                UserPage.delete({
                    pageId: ctrl.pageDetail.page.pageId
                }, function () {
                    $state.go('home');
                }, function () {
                    errorToast.showError("Fehler beim Löschen der Bewertung");
                });
            });
        };
    }];

