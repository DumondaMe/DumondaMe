'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Meine Kontakte', url: 'app/img/address-book.png', color: '#009688', sref: 'contact.myContacts'},
            {description: 'Mich als Kontakt', url: 'app/img/followMe.png', color: '#FFA000', sref: 'contact.contacting'},
            {
                description: 'Kontakt Details',
                url: 'app/img/defaultProfile.png',
                color: '#658092',
                sref: 'contact.detail',
                onlyShowSelected: true
            },
            {description: 'Home', url: 'app/img/home.png', color: '#B3C833', sref: 'home'}];
    }];
