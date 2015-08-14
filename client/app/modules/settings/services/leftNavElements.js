'use strict';

module.exports = [
    function () {
        this.event = 'elyoos.leftNav.changed';

        this.elements = [
            {description: 'Profile', url: 'profile', color: '#009688', sref: 'settings.profile'},
            {description: 'Privatsph\u00e4re', url: 'security', color: '#FFA000', sref: 'settings.privacy'},
            {description: 'Password', url: 'security', color: '#ce5043', sref: 'settings.profile.changePassword', onlyShowSelected: true},
            {description: 'Home', url: 'home', color: '#B3C833', sref: 'home'}];
    }];
