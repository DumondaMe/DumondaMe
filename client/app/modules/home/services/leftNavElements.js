'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'},
            {description: 'Kontakte', url: 'contact', color: '#009688', sref: 'contact.myContacts'},
            {description: 'Nachrichten', url: 'thread', color: '#ce5043', sref: 'message.threads'},
            {description: 'Empfehlungen', url: 'recommendation', color: '#1aa1e1', sref: 'page.overview'}];
    }];
