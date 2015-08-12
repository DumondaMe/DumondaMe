'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Home', url: 'app/img/home.png', color: '#B3C833', sref: 'home'},
            {description: 'Kontakte', url: 'app/img/home/contact.png', color: '#009688', sref: 'contact.myContacts'},
            {description: 'Nachrichten', url: 'app/img/home/email.png', color: '#ce5043', sref: 'message.threads'},
            {description: 'Empfehlungen', url: 'app/img/home/recommend.png', color: '#1aa1e1', sref: 'page.overview'}];
    }];
