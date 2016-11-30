'use strict';

module.exports = ['DateConverter', 'Topics', 'Languages', function (DateConverter, Topics, Languages) {

    this.getCreateLinkPageMessage = function (data) {
        return {
            linkPage: {
                title: data.title,
                description: data.description,
                link: data.link,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages)
            }
        };
    };

    this.getModifyLinkPageMessage = function (data) {
        return {
            linkPage: {
                pageId: data.pageId,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics),
                language: Languages.getCodes(data.selectedLanguages)
            }
        };
    };
}];
