'use strict';

module.exports = ['DateConverter', 'Categories', 'PageYoutubeLink', function (DateConverter, Categories, PageYoutubeLink) {

    this.getCreateYoutubePageMessage = function (data) {
        return {
            youtubePage: {
                title: data.title,
                description: data.description,
                link: PageYoutubeLink.getYoutubeLink(data.link),
                category: Categories.getCodes(data.selectedCategories)
            }
        };
    };

    this.getModifyYoutubePageMessage = function (data) {
        return {
            youtubePage: {
                pageId: data.pageId,
                description: data.description,
                category: Categories.getCodes(data.selectedCategories)
            }
        };
    };
}];
