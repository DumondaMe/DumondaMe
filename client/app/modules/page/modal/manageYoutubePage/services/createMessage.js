'use strict';

module.exports = ['DateConverter', 'Topics', 'PageYoutubeLink', function (DateConverter, Topics, PageYoutubeLink) {

    this.getCreateYoutubePageMessage = function (data) {
        return {
            youtubePage: {
                title: data.title,
                description: data.description,
                link: PageYoutubeLink.getYoutubeLink(data.link),
                topic: Topics.getCodes(data.selectedTopics)
            }
        };
    };

    this.getModifyYoutubePageMessage = function (data) {
        return {
            youtubePage: {
                pageId: data.pageId,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics)
            }
        };
    };
}];
