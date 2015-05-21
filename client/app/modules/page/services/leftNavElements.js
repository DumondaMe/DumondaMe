'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Empfehlungen', url: 'app/img/page/overview.png', color: '#009688', sref: 'page.overview'},
            {
                description: 'Seite',
                url: 'app/img/page/page.png',
                color: '#658092',
                sref: 'page.detail',
                onlyShowSelected: true
            },
            {
                description: 'Seite bearbeiten',
                url: 'app/img/page/pageEdit.png',
                color: '#658092',
                sref: 'page.edit',
                onlyShowSelected: true
            },
            {description: 'Seite erstellen', url: 'app/img/page/pageCreate.png', color: '#FFA000', sref: 'page.create'},
            {description: 'Home', url: 'app/img/home.png', color: '#B3C833', sref: 'home'}];
    }];
