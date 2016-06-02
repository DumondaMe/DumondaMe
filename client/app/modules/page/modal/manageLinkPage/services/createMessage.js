'use strict';

module.exports = ['DateConverter', 'Topics', function (DateConverter, Topics) {

    this.getCreateLinkPageMessage = function (data) {
        return {
            linkPage: {
                title: data.title,
                description: data.description,
                link: data.link,
                topic: Topics.getCodes(data.selectedTopics)
            }
        };
    };

    this.getModifyLinkPageMessage = function (data) {
        return {
            linkPage: {
                pageId: data.pageId,
                description: data.description,
                topic: Topics.getCodes(data.selectedTopics)
            }
        };
    };
}];
