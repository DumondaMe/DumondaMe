'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Empfehlungen', url: 'recommendation', color: '#009688', sref: 'page.overview'},
            {
                description: 'Seite',
                url: 'page',
                color: '#658092',
                sref: 'page.detail',
                onlyShowSelected: true
            },
            {
                description: 'Seite bearbeiten',
                url: 'pageEdit',
                color: '#658092',
                sref: 'page.edit',
                onlyShowSelected: true
            },
            {description: 'Meine Bewertungen', url: 'pageMyRecommendation', color: '#ce5043', sref: 'page.userRecommendation'},
            {description: 'Meine Seiten', url: 'myPage', color: '#1aa1e1', sref: 'page.userPageAdmin'},
            {description: 'Seite erstellen', url: 'add', color: '#FFA000', sref: 'page.create'},
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];
