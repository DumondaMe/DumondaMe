'use strict';

module.exports = ['DateConverter', 'Categories', function (DateConverter, Categories) {

    this.getCreateLinkPageMessage = function (data) {
        return {
            linkPage: {
                title: data.title,
                description: data.description,
                link: data.link,
                category: Categories.getCodes(data.selectedCategories)
            }
        };
    };

    this.getModifyLinkPageMessage = function (data) {
        return {
            linkPage: {
                pageId: data.pageId,
                description: data.description,
                category: Categories.getCodes(data.selectedCategories)
            }
        };
    };
}];
