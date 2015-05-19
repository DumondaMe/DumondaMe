'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: '\u00dcbersicht', url: 'app/img/messages/threads.png', color: '#009688', sref: 'message.threads'},
            {
                description: 'Chat',
                url: 'app/img/messages/chat.png',
                color: '#658092',
                sref: 'message.threads.detail',
                onlyShowSelected: true
            },
            {
                description: 'Neuer Chat',
                url: 'app/img/messages/newChat.png',
                color: '#FFA000',
                sref: 'message.threads.create',
                onlyShowSelected: true
            },
            {description: 'Home', url: 'app/img/home.png', color: '#B3C833', sref: 'home'}];
    }];
