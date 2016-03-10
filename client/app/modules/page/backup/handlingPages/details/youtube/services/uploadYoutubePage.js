'use strict';

module.exports = ['PageCategoryHandler', 'PageHandlingUpload',
    function (PageCategoryHandler, PageHandlingUpload) {
        var ctrl = this;

        ctrl.uploadPage = function (description, link, pageId) {
            var json = {
                youtubePage: {
                    language: PageCategoryHandler.getLanguageCode(),
                    title: PageCategoryHandler.getTitle(),
                    description: description,
                    link: link,
                    pageId: pageId
                }
            };
            PageHandlingUpload.uploadPage(json, pageId, 'Youtube', null);
        };
    }];
