'use strict';

module.exports = ['DateConverter', 'Topics', 'PageYoutubeLink', 'Languages', function (DateConverter, Topics, PageYoutubeLink, Languages) {

    this.getCreateYoutubePageMessage = function (data) {
        return {
            youtubePage: {
                title: data.title,
                description: data.description,
                link: PageYoutubeLink.getYoutubeLink(data.link),
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages)
            }
        };
    };

    this.getModifyYoutubePageMessage = function (data) {
        return {
            youtubePage: {
                pageId: data.pageId,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages)
            }
        };
    };
}];
