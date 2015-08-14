'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Meine Kontakte', url: 'contact', color: '#009688', sref: 'contact.myContacts'},
            {description: 'Mich als Kontakt', url: 'contacting', color: '#FFA000', sref: 'contact.contacting'},
            {
                description: 'Kontakt Details',
                url: 'profile',
                color: '#658092',
                sref: 'contact.detail',
                onlyShowSelected: true
            },
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];
