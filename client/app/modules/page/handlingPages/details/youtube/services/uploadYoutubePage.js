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
                    link: link
                }
            };
            if (pageId) {
                json.youtubePage.pageId = pageId;
            }
            PageHandlingUpload.uploadPage(json, null, 'Youtube', null, false);
        };
    }];
