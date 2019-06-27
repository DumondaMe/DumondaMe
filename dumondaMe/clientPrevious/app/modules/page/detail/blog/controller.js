'use strict';

module.exports = ['$mdDialog', 'Blog', 'errorToast', '$state', 'ElyModal', 'Topics', 'Languages',
    function ($mdDialog, Blog, errorToast, $state, ElyModal, Topics, Languages) {
        var ctrl = this;

        ctrl.editBlog = function () {
            ElyModal.show('ManageBlogCtrl', 'app/modules/page/modal/manageBlog/template.html',
                {
                    data: {
                        pageId: ctrl.blogDetail.page.pageId,
                        title: ctrl.blogDetail.page.title,
                        blogText: ctrl.blogDetail.page.text,
                        selectedTopics: ctrl.blogDetail.page.topic,
                        selectedLanguage: ctrl.blogDetail.page.language,
                        imageForUploadPreview: ctrl.blogDetail.page.url
                    },
                    isEditMode: true
                }).then(function (data) {
                ctrl.blogDetail.page.text = data.text;
                ctrl.blogDetail.page.topic = data.selectedTopics;
                ctrl.blogDetail.page.language = Languages.getCodes([data.selectedLanguage]);
                ctrl.blogDetail.page.url = data.url;
            });
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

