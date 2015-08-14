'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: '\u00dcbersicht', url: 'thread', color: '#009688', sref: 'message.threads'},
            {
                description: 'Chat',
                url: 'chat',
                color: '#658092',
                sref: 'message.threads.detail',
                onlyShowSelected: true
            },
            {
                description: 'Neuer Chat',
                url: 'add',
                color: '#FFA000',
                sref: 'message.threads.create',
                onlyShowSelected: true
            },
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];
